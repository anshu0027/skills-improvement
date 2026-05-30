import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("agents")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "A regular function does one thing and stops. An agent is a program that keeps going — it uses an LLM to decide what tool to call next, calls it, looks at the result, and then decides again, in a loop, until the goal is done. Think of it as giving an LLM a set of hands: it can search the web, run code, read a database, and chain those actions together to finish a task you couldn't fit in one prompt.",
  concepts: [
    {
      title: "What an agent is",
      explain:
        "An agent is the combination of three things: an LLM that reasons, a set of tools it can call, and a loop that keeps running until a stop condition is met. On each turn the model reads its history plus the latest tool result, decides whether to call another tool or to reply, and the host program executes whatever the model chose. The LLM never executes code itself — it only emits a structured decision ('call tool X with args Y') and your runtime does the work. The key difference from a simple prompt is the loop: the model can take as many steps as needed, backtrack, and adapt based on intermediate results.",
      code: `// Minimal agent loop (pseudocode)
let messages = [{ role: "user", content: task }];
for (let step = 0; step < MAX_STEPS; step++) {
  const res = await llm.chat({ messages, tools });
  if (res.stopReason === "end_turn") { return res.text; }
  const toolCall = res.toolUse;
  const result   = await executeTool(toolCall.name, toolCall.input);
  messages.push({ role: "assistant", content: res.content });
  messages.push({ role: "tool",      content: result, toolUseId: toolCall.id });
}
throw new Error("Max steps reached");`,
      note: "Every extra step is an API call. A six-step research agent at gpt-4o pricing can cost 10–30× more than a single prompt. Model the expected depth before choosing an agentic approach.",
    },
    {
      title: "ReAct: reason → act → observe",
      explain:
        "ReAct (Reasoning + Acting) is the foundational pattern for agents. On each turn the model is prompted to first write a 'thought' (why it is doing what it is doing), then emit an 'action' (which tool, with what arguments), and the host provides an 'observation' (the tool result). This chain of thought before acting improves accuracy on multi-step tasks and makes agent behavior auditable — you can read the log and see exactly why the model took each step.",
      code: `// System prompt fragment for ReAct
\`You operate in a loop. On each turn write:
Thought: <why you are taking this action>
Action: <tool_name>
Action Input: <JSON args>
Then wait for Observation: <result>.
When you have enough information write Final Answer: <answer>.\`

// Turn log
// Thought: I need current BTC price to compute portfolio value.
// Action: web_search
// Action Input: { "query": "BTC USD price 2026" }
// Observation: "Bitcoin is trading at $72,450 as of 2026-05-31."
// Thought: I have the price. I can now compute the value.
// Final Answer: Portfolio is worth $724,500.`,
      note: "ReAct's explicit reasoning trace is invaluable for debugging production agents. Capture it in your logging pipeline so you can replay and root-cause any bad decision.",
    },
    {
      title: "Tool / function calling",
      explain:
        "Function calling is the mechanism by which a model signals it wants to invoke a tool. You pass a list of JSON-Schema tool definitions alongside the messages. The model responds not with text but with a structured object naming the tool and its arguments. Your code validates the arguments, executes the function, and returns the result as a 'tool' role message. The model never calls anything directly — it only asks, and you decide whether to execute it. This separation is what makes human-in-the-loop approval possible.",
      code: `// Tool definition (Anthropic style)
const tools = [
  {
    name: "get_weather",
    description: "Return current weather for a city.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string", description: "City name, e.g. Mumbai" },
      },
      required: ["city"],
    },
  },
];

// Model response fragment
// { type: "tool_use", id: "tu_01", name: "get_weather", input: { city: "Mumbai" } }

// Your executor
async function executeTool(name: string, input: unknown) {
  if (name === "get_weather") return fetchWeather((input as { city: string }).city);
  throw new Error(\`Unknown tool: \${name}\`);
}`,
      note: "Always validate tool inputs against the same schema you sent to the model — the model can hallucinate args that look plausible but violate constraints. Use zod or ajv to reject bad calls before execution.",
    },
    {
      title: "Planning vs reactive agents",
      explain:
        "A reactive agent (like ReAct) decides its next action one step at a time based on the latest observation — no upfront plan. A planning agent first generates a full task plan (a list of subtasks), then executes each one. Planning agents handle deep, structured tasks better (writing a report, building a feature); reactive agents adapt better to unpredictable environments (browsing the live web). Many production agents combine both: a high-level planner that creates subtasks and reactive sub-agents that execute each one.",
      code: `// Planner output example (LLM returns JSON)
const plan = await llm.json({
  prompt: \`Break this task into ordered subtasks: "\${task}"\`,
  schema: z.array(z.object({ step: z.number(), action: z.string() })),
});
// [{ step: 1, action: "Search for competitor pricing" },
//  { step: 2, action: "Summarize findings" },
//  { step: 3, action: "Draft comparison table" }]

for (const subtask of plan) {
  await reactiveAgent(subtask.action, tools);
}`,
      note: "Pure planning agents are brittle — if step 2 fails the entire plan breaks. Hybrid architectures re-plan on failure, which is more resilient but costs more tokens.",
    },
    {
      title: "Memory: scratchpad vs long-term store",
      explain:
        "Short-term memory is the context window — everything in `messages`. It is fast but finite and costs tokens per call. Long-term memory is an external store (vector DB, key-value, SQL) that the agent can search via a tool. A common pattern: after each session, summarize the key facts and embed them so future runs can retrieve them with semantic search. Without external memory, an agent forgets everything when the context resets.",
      code: `// Long-term memory read tool
async function recall(query: string): Promise<string> {
  const results = await vectorDB.query({ text: query, topK: 5 });
  return results.map((r) => r.content).join("\\n---\\n");
}

// Long-term memory write (after session)
async function memorize(summary: string) {
  const embedding = await embedder.embed(summary);
  await vectorDB.upsert({ id: uuid(), embedding, content: summary });
}`,
      note: "Context window management is a real cost driver. At 128k tokens × $15/M, a fully loaded context is expensive per call. Retrieving only the top-5 relevant memories keeps cost linear instead of quadratic.",
    },
    {
      title: "Agentic RAG (multi-step retrieval)",
      explain:
        "Standard RAG does one retrieval then answers. Agentic RAG gives the model a 'search' tool and lets it retrieve multiple times — it can rephrase the query based on what it found, decide it needs more context, or search a different source. This dramatically improves accuracy for complex questions but at the cost of latency and tokens. It is the pattern behind Perplexity and most deep-research agents.",
      code: `const searchTool = {
  name: "search_docs",
  description: "Semantic search over internal documentation.",
  input_schema: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
  },
};

// Agent loop: model may call search_docs 3–5 times, refining each query
// before synthesising a final answer — no single retrieval needed to be perfect.`,
      note: "Measure recall@5 on a golden eval set before and after switching to agentic RAG. The accuracy gain is real but so is the p95 latency jump — alert on both in production.",
    },
    {
      title: "LangGraph: state machines for agents",
      explain:
        "LangGraph models an agent as a directed graph where nodes are functions (an LLM call, a tool executor, a human approval step) and edges are transitions. Edges can be conditional ('if tool call → tool node, else → end'). Crucially, LangGraph supports cycles — the graph can loop back — which is exactly what a ReAct agent needs. State is a typed dict threaded through every node. LangGraph also supports streaming, interrupts (pause for human), and checkpointing (resume after failure).",
      code: `// LangGraph-style pseudocode (Python-inspired, illustrative)
import { StateGraph, END } from "@langchain/langgraph";

const graph = new StateGraph<AgentState>()
  .addNode("llm",  callLLM)
  .addNode("tool", runTool)
  .addEdge("__start__", "llm")
  .addConditionalEdges("llm", routeAfterLLM, {
    call_tool: "tool",
    end:       END,
  })
  .addEdge("tool", "llm")   // loop back
  .compile();

async function routeAfterLLM(state: AgentState) {
  return state.lastMessage.tool_calls?.length ? "call_tool" : "end";
}`,
      note: "LangGraph's checkpointing (persisting state to Redis or Postgres) lets you resume a long-running agent after a crash or after a human approves a step. Essential for agentic workflows that run for minutes or hours.",
    },
    {
      title: "Multi-agent systems: supervisor / worker",
      explain:
        "A single agent with 20 tools degrades — the model struggles to choose. The solution is specialization: a supervisor agent receives the task, breaks it into subtasks, and dispatches each to a worker agent that has only the tools it needs. Workers return results to the supervisor, which synthesises the final answer. Agents can also run in parallel — the supervisor fans out, workers run concurrently, and the supervisor joins the results.",
      code: `// Supervisor dispatches to specialist workers
async function supervisorAgent(task: string) {
  const plan = await plannerLLM(task);
  const results = await Promise.all(
    plan.subtasks.map((s) => {
      if (s.type === "research")  return researchAgent(s.query);
      if (s.type === "code")      return codeAgent(s.spec);
      if (s.type === "write")     return writerAgent(s.outline);
      throw new Error(\`Unknown subtask type: \${s.type}\`);
    })
  );
  return synthesizerLLM(task, results);
}`,
      note: "Multi-agent systems multiply cost and latency. Profile before adding agents: a single well-prompted agent with structured output often outperforms a complex multi-agent graph for tasks that fit in one context window.",
    },
    {
      title: "LlamaIndex Workflows",
      explain:
        "LlamaIndex Workflows are an event-driven alternative to LangGraph. You define steps (async functions decorated with `@step`) that emit and receive typed events. The runtime routes events to the right step. This model makes parallel fan-out natural — one step can emit multiple events that trigger multiple steps concurrently — and keeps each step independently testable. LlamaIndex also ships pre-built agentic RAG components (QueryPipeline, SubQuestionQueryEngine) that plug into Workflows.",
      code: `// LlamaIndex Workflow pseudocode
class ResearchWorkflow extends Workflow {
  @step
  async plan(ev: StartEvent): Promise<PlanEvent> {
    const subtasks = await planner(ev.task);
    return new PlanEvent({ subtasks });
  }

  @step
  async search(ev: PlanEvent): Promise<ResultEvent[]> {
    return Promise.all(ev.subtasks.map((t) => searcher(t)));
  }

  @step
  async synthesize(ev: ResultEvent[]): Promise<StopEvent> {
    const answer = await synthesizer(ev.map((r) => r.content));
    return new StopEvent({ result: answer });
  }
}`,
      note: "LlamaIndex Workflows are easier to unit-test than LangGraph graphs because each step is a plain async function with typed inputs/outputs. Consider them for data-heavy pipelines (RAG, ETL) where LangGraph's state machine model is heavier than needed.",
    },
    {
      title: "Guardrails, validation, and human-in-the-loop",
      explain:
        "Agents can take irreversible actions — send an email, write to a database, charge a card. Guardrails are checks you run before or after a tool call to prevent harm. Input guardrails validate what the model is about to do ('does this SQL query look destructive?'). Output guardrails check what came back ('did this code pass a linter?'). Human-in-the-loop (HITL) is the ultimate guardrail: pause the agent, surface the proposed action to a human, and only continue on approval. LangGraph supports this natively via interrupt().",
      code: `// Input guardrail before executing a DB write
async function guardedWrite(sql: string) {
  if (/DROP|TRUNCATE|DELETE.*WHERE/i.test(sql)) {
    await notifyHuman({ action: "dangerous_sql", sql });
    const approved = await waitForApproval(sql);  // blocks until human responds
    if (!approved) throw new Error("Action rejected by human.");
  }
  return db.query(sql);
}

// LangGraph interrupt (Python-style, illustrative)
// graph.addNode("write_db", writeNode);
// graph.addInterrupt("write_db");   // pauses here, resumes on resume()`,
      note: "HITL is not just for safety — it is a product feature. B2B customers are willing to pay for agents that keep a human in control of high-stakes actions. Build the approval UI as a first-class part of the product.",
    },
    {
      title: "Preventing infinite loops and cost control",
      explain:
        "Without limits an agent can loop forever — the model keeps calling tools, never converging. Three defences: (1) MAX_STEPS hard limit, (2) a token budget — track total tokens used and stop when exceeded, (3) a 'convergence check' that detects if the last N tool calls were identical (the model is stuck). Add a timeout at the infrastructure level as a final backstop. Log cost and step count for every agent run so you can set sensible budgets.",
      code: `async function agentLoop(task: string) {
  let messages = [{ role: "user" as const, content: task }];
  let totalTokens = 0;
  const MAX_STEPS = 20;
  const TOKEN_BUDGET = 50_000;
  const recentTools: string[] = [];

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await llm.chat({ messages, tools });
    totalTokens += res.usage.input + res.usage.output;
    if (totalTokens > TOKEN_BUDGET) throw new Error("Token budget exceeded.");
    if (res.stopReason === "end_turn") return res.text;

    const toolName = res.toolUse.name;
    recentTools.push(toolName);
    if (recentTools.slice(-4).every((t) => t === toolName))
      throw new Error(\`Agent stuck in loop calling \${toolName}\`);

    const result = await executeTool(toolName, res.toolUse.input);
    messages.push({ role: "assistant", content: res.content });
    messages.push({ role: "tool", content: result, toolUseId: res.toolUse.id });
  }
  throw new Error("Max steps reached.");
}`,
      note: "Track agent run cost in your observability stack (LangSmith, Arize, custom). Alert when any single run exceeds 3× the p50 cost — that is usually a stuck agent, not a hard task.",
    },
    {
      title: "Evaluating agents: trajectory + outcome",
      explain:
        "You cannot evaluate an agent only on final output — a correct answer via a wrong path is fragile. Evaluate two dimensions: (1) outcome — did it produce the right final answer / action? and (2) trajectory — did it take sensible steps, in a reasonable number of turns, without unnecessary tool calls? Use a golden evaluation set: 20–50 tasks with known correct answers and expected tool call sequences. Run evals on every code change. Tools: LangSmith, Braintrust, custom pytest harnesses.",
      code: `// Eval harness sketch
const evals = [
  { task: "What is the capital of France?", expected: "Paris", maxSteps: 1 },
  { task: "Find today's BTC price and add 10%.", expected: /\\$[0-9,]+/, maxSteps: 3 },
];

for (const ev of evals) {
  const { answer, steps } = await agentLoop(ev.task);
  const outcomeOk = typeof ev.expected === "string"
    ? answer.includes(ev.expected)
    : ev.expected.test(answer);
  const trajectoryOk = steps <= ev.maxSteps;
  console.log({ task: ev.task, outcomeOk, trajectoryOk });
}`,
      note: "In production, sample 1–5% of live agent runs and have a human label them (correct / incorrect / hallucinated). This data feeds your eval suite so it drifts with real usage rather than staying a static benchmark.",
    },
  ],
  interviewQs: [
    {
      q: "What is the difference between an agent and a chain?",
      a: "A chain is a fixed, pre-determined sequence of steps (prompt → retrieval → prompt → output) — the flow is set at development time. An agent uses an LLM to decide at runtime which step to take next, can call tools in any order, and loops until done. Chains are predictable and cheap; agents are flexible but costly and harder to debug.",
    },
    {
      q: "Explain the ReAct pattern.",
      a: "ReAct interleaves reasoning and acting. On each turn the model writes a Thought (why it is doing this), picks an Action (tool name + args), and the host returns an Observation (tool result). This continues until the model writes a Final Answer. The reasoning trace makes the agent's decisions auditable and improves accuracy on multi-step tasks because the model 'thinks aloud' before committing.",
    },
    {
      q: "How does function / tool calling work under the hood?",
      a: "You send a list of JSON-Schema tool definitions alongside the messages array. The model is fine-tuned to respond with a structured tool-use object instead of text when it wants to call a tool. Your code receives that object, validates the arguments, executes the function, and sends back a tool-role message with the result. The model never executes anything — it only requests, and your runtime decides whether to comply.",
    },
    {
      q: "How do you stop a runaway agent from looping forever or spending too much?",
      a: "Three controls: (1) MAX_STEPS hard limit — abort after N iterations. (2) Token budget — track cumulative input+output tokens and stop if exceeded. (3) Stuck-loop detection — if the last 4 tool calls are identical, the agent is cycling; terminate it. Add a wall-clock timeout at the infrastructure layer as a final backstop. Log cost and step count per run so you can tune these thresholds over time.",
    },
    {
      q: "LangGraph vs plain LangChain — when do you use each?",
      a: "Plain LangChain chains are for linear, acyclic flows (retrieve → prompt → parse). LangGraph is for anything that needs a loop, branching, or parallel sub-tasks — i.e., real agents. LangGraph adds typed state, conditional edges, cycles, checkpointing (persist and resume), and HITL interrupts. Use LangGraph as soon as the agent needs to loop back or branch; the overhead is worth it for debuggability and resilience.",
    },
    {
      q: "How do you manage agent state and memory across sessions?",
      a: "Within a session, state lives in the messages array (context window). Across sessions, persist to an external store: a vector DB for semantic memory (embed summaries, retrieve by similarity), a key-value store for structured facts, or a relational DB for structured history. The agent gets a 'recall' tool to query long-term memory and a 'memorize' step runs after each session to compress and store what was learned.",
    },
    {
      q: "When is an agent overkill? When should you use a simpler approach?",
      a: "Use a simple prompt or chain when: the task fits in one context window, the steps are always the same, low latency is critical, or cost is a hard constraint. An agent is justified when: the number of steps is unknown at design time, the agent must adapt based on intermediate results, or the task requires combining more than 2–3 tools dynamically. Rule of thumb: try the simplest thing first; add an agent loop only when the simpler approach demonstrably fails.",
    },
    {
      q: "What are guardrails and why are they important for agents?",
      a: "Guardrails are validation steps that run before and/or after tool calls. Input guardrails check whether the agent's proposed action is safe (e.g., block destructive SQL, rate-limit external API calls). Output guardrails validate that the tool result is well-formed before feeding it back to the model. Human-in-the-loop is the strictest guardrail — pausing execution for a human to approve high-stakes actions. Without guardrails, an agent can take irreversible actions (delete data, send emails, charge cards) based on a hallucinated tool call.",
    },
    {
      q: "What is the supervisor / worker pattern in multi-agent systems?",
      a: "A supervisor agent receives the high-level task, breaks it into subtasks, and routes each to a specialized worker agent with a focused toolset. Workers execute their subtask and return results. The supervisor synthesizes the final answer. This avoids the 'too many tools' problem — a model choosing from 20 tools degrades in quality — while enabling parallelism: the supervisor can fan out to multiple workers concurrently.",
    },
    {
      q: "How do you evaluate an agent beyond just checking the final answer?",
      a: "Evaluate both outcome (did it produce the correct result?) and trajectory (did it take the right steps in a sensible number of turns?). Build a golden eval set of 20–50 tasks with known answers and expected tool call sequences. Run it on every code change. In production, sample live runs and have a human label them. Tools like LangSmith and Braintrust automate trajectory scoring against golden traces.",
    },
    {
      q: "What is agentic RAG and how does it improve over standard RAG?",
      a: "Standard RAG does one retrieval query then answers. Agentic RAG gives the model a search tool and lets it retrieve multiple times — it can rephrase the query based on partial results, search different sources, or decide it has enough context and stop. This improves accuracy on complex questions because no single retrieval needs to be perfect. The trade-off is higher latency and token cost: measure retrieval quality before and after to confirm the gain justifies the expense.",
    },
  ],
  build: [
    "Build a ReAct agent with three tools (web search, calculator, current date) using the Anthropic API directly — no framework. Implement MAX_STEPS, token budget, and stuck-loop detection. Log every Thought/Action/Observation turn to the console.",
    "Build a LangGraph agent that researches a topic: a 'planner' node breaks the task into 3 subtasks, three parallel 'search' nodes execute them, and a 'synthesizer' node writes the final answer. Add a human-in-the-loop interrupt before the synthesizer runs.",
    "Build an agentic RAG system over a local document corpus: the agent can call search_docs (vector search) multiple times, refining its query, and stops when it has cited at least three distinct passages. Measure answer quality against a five-question golden set before and after enabling multi-step retrieval.",
    "Build a multi-agent code-review system: a supervisor agent breaks a PR diff into file groups and dispatches each to a worker agent with a 'run_linter' and 'check_style' tool. The supervisor collects findings and produces a single structured report. Track total token cost per review run.",
  ],
  pitfalls: [
    "Not setting a MAX_STEPS or token budget — a misconfigured tool or a stuck model will loop until you hit an API timeout or a runaway bill. Always cap both.",
    "Feeding raw, unvalidated tool output back to the model — a malformed result can confuse the model or enable prompt injection (the tool result contains instructions). Sanitize and schema-validate every tool response before it re-enters the context.",
    "Using one agent with 15+ tools — tool selection accuracy degrades sharply above 10 tools. Split into specialized agents, or use a retrieval step to surface only the relevant tools for each turn.",
    "Ignoring trajectory evaluation — an agent that gets the right answer via 12 steps when 3 suffice is expensive and brittle in production. Evaluate step count and tool choice, not just final output.",
    "Treating memory as just a longer context window — blindly appending all history hits the context limit, drives up costs, and dilutes attention. Compress, summarize, and store to a retrieval layer; only surface what is relevant per turn.",
  ],
  resources: [
    { label: "LangGraph documentation (LangChain)", url: "https://langchain-ai.github.io/langgraph/" },
    { label: "LlamaIndex Workflows guide", url: "https://docs.llamaindex.ai/en/stable/module_guides/workflow/" },
    { label: "Anthropic tool use documentation", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
    { label: "LangChain agents conceptual guide", url: "https://python.langchain.com/docs/concepts/agents/" },
    { label: "ReAct: Synergizing Reasoning and Acting (paper)", url: "https://arxiv.org/abs/2210.03629" },
    { label: "LangSmith agent evaluation guide", url: "https://docs.smith.langchain.com/evaluation/how_to_guides/evaluate_llm_application" },
  ],
  checklist: [
    "Explain what an agent is and how it differs from a chain or a single prompt",
    "Implement a ReAct agent loop from scratch with tool calling, MAX_STEPS, and token budget",
    "Define a JSON-Schema tool, handle the model's tool-use response, and return the result correctly",
    "Build a LangGraph graph with at least one cycle and a conditional edge",
    "Add a human-in-the-loop interrupt to a LangGraph agent and test the approval path",
    "Implement both short-term (messages array) and long-term (vector DB recall/memorize) memory",
    "Write an eval harness that measures both outcome accuracy and trajectory step count",
    "Identify at least two scenarios where a simple chain is better than an agent",
  ],
};
