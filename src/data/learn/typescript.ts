import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("typescript")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "JavaScript lets you write `user.nmae` and only find out it's wrong when a user hits that screen. TypeScript is JavaScript plus labels on your data, so the editor underlines that typo before you even save. Same JavaScript at runtime — it just adds a layer that checks your work as you type.",
  concepts: [
    {
      title: "Types & type inference",
      explain:
        "A type is a label that says what shape a value has — `string`, `number`, `boolean`, an object, an array. You rarely write them everywhere: TypeScript infers the type from the value, so `let n = 5` is already `number`. You mostly add types at the edges — function parameters and return values — and let inference do the rest inside.",
      code: `let title = "Two Sum";        // inferred: string
const score = 42;             // inferred: 42 (literal)

function add(a: number, b: number): number {
  return a + b;
}
add(2, 3);      // ok
add(2, "3");    // compile error: "3" is not a number`,
      note: "Types are erased at build time — there is zero runtime cost. The value you ship is plain JavaScript; the checking happened on your machine, like a spell-checker for data shapes.",
    },
    {
      title: "interface vs type alias",
      explain:
        "Both name a shape. `interface` is best for object shapes you might extend or that describe a public contract; it can be re-opened (declaration merging). `type` is more flexible — it can also name unions, tuples, and mapped types. Rule of thumb: `interface` for objects, `type` for everything else; either is fine for objects.",
      code: `interface User { id: string; name: string; }
interface User { email: string; }   // merges → { id, name, email }

type Id = string | number;          // a union — only 'type' can do this
type Point = [number, number];      // a tuple`,
      note: "API teams expose request/response shapes as interfaces so consumers can extend them. In a monorepo, sharing one interface between the Node API and the React client kills a whole class of frontend/backend drift bugs.",
    },
    {
      title: "Union & literal types",
      explain:
        "A union (`A | B`) means the value is one of several types. A literal type pins a value to exact constants, like `\"GET\" | \"POST\"`. Together they replace loose strings with a fixed menu the compiler enforces.",
      code: `type Method = "GET" | "POST" | "PUT" | "DELETE";
function request(method: Method, url: string) { /* ... */ }

request("GET", "/users");    // ok
request("FETCH", "/users");  // error: "FETCH" is not a Method`,
      note: "Literal unions are how you model finite states — order status, user role, feature flags — without a database enum or a typo slipping into production.",
    },
    {
      title: "Discriminated unions + exhaustiveness",
      explain:
        "Give each variant of a union a shared `kind`/`type` tag. TypeScript then narrows to the right variant inside a `switch`. Add a `never` in the default branch and the compiler forces you to handle every case — if a teammate adds a new variant later, the build breaks until they handle it.",
      code: `type Event =
  | { kind: "click"; x: number; y: number }
  | { kind: "scroll"; delta: number };

function handle(e: Event) {
  switch (e.kind) {
    case "click":  return e.x + e.y;     // narrowed to click
    case "scroll": return e.delta;       // narrowed to scroll
    default: {
      const _exhaustive: never = e;      // error if a case is unhandled
      return _exhaustive;
    }
  }
}`,
      note: "This is the type-system version of a state machine. Reducers, webhook handlers, and message-queue consumers use it so adding a new event type can never silently fall through unhandled.",
    },
    {
      title: "Generics",
      explain:
        "A generic is a type parameter — a placeholder for a type the caller fills in — so one function or type works for many types without losing safety. `Array<T>` is the everyday example. You write the logic once and keep the exact type flowing through.",
      code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const a = first([1, 2, 3]);        // a: number | undefined
const b = first(["x", "y"]);       // b: string | undefined

interface ApiResponse<T> { data: T; error: string | null; }`,
      note: "A typed API client (`get<User>('/me')`) uses generics so every call site knows the exact response shape — no casting, no guessing. This is what makes large codebases refactor-safe.",
    },
    {
      title: "Utility types",
      explain:
        "Built-in generics that transform existing types so you don't repeat yourself. `Partial<T>` makes all fields optional, `Pick<T,K>`/`Omit<T,K>` select or drop fields, `Record<K,V>` builds a map type, `ReturnType<F>` extracts a function's return type.",
      code: `interface User { id: string; name: string; email: string; }

type UserUpdate = Partial<User>;          // all optional → PATCH body
type PublicUser = Omit<User, "email">;    // drop sensitive field
type UsersById = Record<string, User>;    // { [id]: User }`,
      note: "Deriving a `PATCH` body as `Partial<User>` or a public DTO as `Omit<User,'passwordHash'>` means your types stay in sync with one source of truth — change the model once, every derived shape updates.",
    },
    {
      title: "Narrowing & type guards",
      explain:
        "Narrowing is how TypeScript figures out a more specific type inside a branch — via `typeof`, `in`, `Array.isArray`, or a custom guard function returning `x is T`. After the check, the value is safely treated as the narrower type.",
      code: `function len(x: string | string[]): number {
  if (typeof x === "string") return x.length;   // narrowed to string
  return x.length;                               // narrowed to string[]
}

function isUser(v: unknown): v is User {
  return typeof v === "object" && v !== null && "id" in v;
}`,
      note: "Custom guards are the safe gate at a system boundary — validating an external webhook payload or a JSON blob from a queue before the rest of your typed code trusts it.",
    },
    {
      title: "unknown vs any vs never",
      explain:
        "`any` switches off type checking — avoid it. `unknown` is the safe top type: you can hold anything but must narrow before using it. `never` is the bottom type — a value that can't exist, used for exhaustiveness and functions that always throw.",
      code: `let a: any = 5; a.foo.bar;        // compiles, crashes at runtime — bad
let u: unknown = 5; u.toFixed();  // error: must narrow first — good
function fail(msg: string): never { throw new Error(msg); }`,
      note: "Type incoming JSON as `unknown`, then validate. The difference between `any` and `unknown` is the difference between hoping external data is correct and proving it before you touch it.",
    },
    {
      title: "Runtime validation with zod",
      explain:
        "Types vanish at runtime, so they cannot check data that arrives while the app is running — API requests, env vars, LLM JSON output. A schema library like zod validates at runtime AND infers a static type from the same schema, so you write the shape once.",
      code: `import { z } from "zod";

const User = z.object({ id: z.string(), age: z.number().int().min(0) });
type User = z.infer<typeof User>;          // static type, free

const parsed = User.parse(await req.json()); // throws if shape is wrong`,
      note: "This is the contract at every untrusted boundary: HTTP bodies, third-party webhooks, and especially LLM 'structured output', which is just a string until you validate it. One schema = compile-time type + runtime guarantee.",
    },
    {
      title: "Typing React props & hooks",
      explain:
        "Components get a typed props object; `useState` infers from its initial value (or you pass the type explicitly); event handlers get typed events. This removes the most common React bugs — passing the wrong prop or mishandling an event.",
      code: `type Props = { label: string; onPick: (id: string) => void };

function Item({ label, onPick }: Props) {
  const [open, setOpen] = useState(false);          // boolean
  const [user, setUser] = useState<User | null>(null);
  return <button onClick={() => onPick(label)}>{label}</button>;
}`,
      note: "In a MERN/Next app, typed props are living documentation — a new dev sees exactly what a component needs, and a rename in the model ripples to every usage at compile time instead of in QA.",
    },
    {
      title: "`as const` and `satisfies`",
      explain:
        "`as const` freezes a value into its narrowest literal, read-only form — great for config and turning an array into a union. `satisfies` checks a value matches a type WITHOUT widening it, so you keep the precise inferred type and still get validation.",
      code: `const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number];   // "admin" | "editor" | "viewer"

const config = { port: 3000, host: "localhost" } satisfies Record<string, unknown>;
config.port;   // still number, not unknown`,
      note: "Deriving a `Role` union from one `as const` array means your allowed-values list and your type can never disagree — add a role to the array and the type updates automatically.",
    },
    {
      title: "tsconfig & strict mode",
      explain:
        "`tsconfig.json` controls how strict the checker is. Turn on `strict` (which enables `strictNullChecks`, `noImplicitAny`, and more). `strictNullChecks` is the big one — it forces you to handle `null`/`undefined`, killing the classic 'cannot read property of undefined' crash.",
      code: `// tsconfig.json
{ "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }

const u: User | undefined = users.find(x => x.id === id);
u.name;        // error: u might be undefined
u?.name;       // ok`,
      note: "`strict: true` from day one is non-negotiable on real teams; retrofitting it onto a loose codebase is painful. `noUncheckedIndexedAccess` additionally flags array access that might be out of bounds.",
    },
  ],
  interviewQs: [
    {
      q: "What's the difference between `any` and `unknown`?",
      a: "`any` disables type checking — you can do anything with it and the compiler stays silent, which reintroduces runtime crashes. `unknown` is type-safe: it can hold any value but you must narrow it (with `typeof`, a guard, or a schema) before using it. Use `unknown` at boundaries, never `any`.",
    },
    {
      q: "interface vs type — when do you use each?",
      a: "Both describe object shapes. `interface` supports declaration merging and is conventional for public/extendable object contracts. `type` is more general — it can express unions, tuples, intersections, and mapped types. Objects: either; unions/tuples/utility shapes: `type`.",
    },
    {
      q: "What are generics and why use them?",
      a: "Generics are type parameters that let one function/type work across many types while preserving the exact type. They avoid both duplication and `any` — e.g. a `fetch<T>` helper returns `T` so each call site is fully typed without casting.",
    },
    {
      q: "Explain discriminated unions and exhaustiveness checking.",
      a: "A union where each member has a shared literal tag (`kind`). TypeScript narrows to the right member by that tag. Assigning the value to `never` in the `default` branch makes the compiler error if any case is unhandled — so adding a new variant forces every switch to be updated.",
    },
    {
      q: "Types disappear at runtime — how do you validate external data?",
      a: "With a runtime schema validator like zod or valibot. You define the schema once, `z.infer` gives you the static type for free, and `.parse()` throws on bad data at runtime. Essential for HTTP bodies, env vars, and LLM structured output.",
    },
    {
      q: "What is structural typing?",
      a: "TypeScript checks compatibility by shape, not by name (unlike Java's nominal typing). If an object has all the required properties of a type, it's assignable to it — 'if it has the shape, it fits'.",
    },
    {
      q: "When would you use `Partial`, `Pick`, and `Omit`?",
      a: "`Partial<T>` for update/PATCH bodies (all optional), `Pick<T,K>` to expose a subset, `Omit<T,K>` to strip sensitive fields like a password hash when building a public DTO. They derive from one source type so shapes stay in sync.",
    },
    {
      q: "What does `strictNullChecks` do?",
      a: "It separates `null`/`undefined` from other types, so a possibly-absent value must be handled (optional chaining, a guard, or a default) before use. It eliminates the most common JS crash — reading a property of undefined.",
    },
    {
      q: "Difference between `void` and `never`?",
      a: "`void` means a function returns nothing useful (it does return). `never` means it never returns at all — it always throws or loops forever — and is also the type of an impossible value used for exhaustiveness.",
    },
    {
      q: "What does `as const` do?",
      a: "It makes a literal deeply read-only and as narrow as possible. An array becomes a readonly tuple of literals, which you can index with `[number]` to derive a union type — keeping a values list and its type perfectly in sync.",
    },
  ],
  build: [
    "Convert one existing Express route to TypeScript: type `req`/`res`, validate the body with zod, and return a typed response.",
    "Write a generic typed API client `api.get<T>(url)` / `api.post<T,B>(url, body)` and use it from a React component with no `any`.",
    "Take a small JS utility file and turn on `strict`; fix every error and note what real bugs it surfaced.",
    "Model a feature's states as a discriminated union and write an exhaustive reducer with a `never` default.",
  ],
  pitfalls: [
    "Reaching for `any` to silence an error — it hides the bug instead of fixing it. Use `unknown` + narrowing.",
    "Trusting external JSON because it 'has a type' — types are compile-time only; validate at runtime with zod.",
    "Overusing `enum`; a union of string literals (or `as const`) is simpler, tree-shakeable, and JSON-friendly.",
    "Casting with `as` to force a shape — it overrides the compiler and can crash at runtime. Prefer guards.",
  ],
  resources: [
    { label: "TypeScript Handbook (official)", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
    { label: "Total TypeScript (Matt Pocock)", url: "https://www.totaltypescript.com/" },
    { label: "type-challenges (practice)", url: "https://github.com/type-challenges/type-challenges" },
    { label: "Zod documentation", url: "https://zod.dev/" },
  ],
  checklist: [
    "Explain any vs unknown vs never with an example",
    "Write a generic function and a generic interface from scratch",
    "Model a feature with a discriminated union + exhaustive switch",
    "Validate an API body with zod and infer its type",
    "Turn on strict mode in a project and clear all errors",
    "Use Partial/Pick/Omit/Record to derive types from one model",
    "Type a React component's props, state, and event handlers",
  ],
};
