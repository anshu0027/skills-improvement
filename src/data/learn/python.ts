import type { Module } from "@/data/learn/types";
import { getModuleMeta } from "@/data/learn/meta";

const meta = getModuleMeta("python")!;

export const learnModule: Module = {
  ...meta,
  simple:
    "Python is the language the entire AI ecosystem agreed to use. Think of it like JavaScript but with mandatory indentation instead of curly braces — a lot of the syntax is simpler, but the ecosystem for ML, data, and AI tooling is unmatched. FastAPI is the Express.js of Python: it's a lightweight web framework that runs on an async server, validates data automatically, and generates API docs without any extra work. If you know JS, you can be productive in Python in days — the new skill is really the ecosystem.",
  concepts: [
    {
      title: "Python basics for JS developers",
      explain:
        "Python uses indentation (4 spaces) instead of braces to delimit blocks — a wrong indent is a syntax error, not a style issue. Variables are dynamically typed like JS but there are no `let`/`const`/`var`. Python has `list` (like JS Array), `dict` (like JS Object), `set` (unique values), and `tuple` (immutable list). Key differences: `None` instead of `null`, `True`/`False` capitalized, `//` is integer division, `**` is exponentiation, and `f\"hello {name}\"` is the template literal.",
      code: `# variables — no var/let/const
name = "Alice"
score = 42
is_active = True        # capitalized, not 'true'
nothing = None          # not 'null'

# list (mutable, ordered)
nums = [1, 2, 3]
nums.append(4)          # [1, 2, 3, 4]

# dict (key-value, ordered in Python 3.7+)
user = {"id": 1, "name": "Alice"}
user["email"] = "a@b.com"

# set (unique values)
tags = {"python", "fastapi", "python"}   # {"python", "fastapi"}

# tuple (immutable)
point = (10, 20)

# f-string (template literal)
msg = f"User {user['name']} has score {score}"`,
      lang: "python",
      note: "Coming from JS you will miss optional semicolons and braces briefly, then never again. The biggest foot-gun: mutable default arguments (`def fn(x=[])` — the list is shared across calls). Use `None` as default and create the list inside.",
    },
    {
      title: "List / dict / set comprehensions",
      explain:
        "Comprehensions are Python's concise way to build a list, dict, or set from an iterable — like a one-liner `map` + `filter`. They are faster than explicit loops (the interpreter optimises them) and idiomatic; senior Python devs use them constantly. JS has `.map()` and `.filter()`; Python's comprehensions do both in one expression.",
      code: `numbers = [1, 2, 3, 4, 5, 6]

# list comprehension: [expression for item in iterable if condition]
evens = [n * 2 for n in numbers if n % 2 == 0]   # [4, 8, 12]

# dict comprehension
squared = {n: n**2 for n in numbers}              # {1:1, 2:4, 3:9, ...}

# set comprehension
unique_lengths = {len(w) for w in ["hi", "hello", "hey"]}  # {2, 5, 3}

# generator expression (lazy, memory-efficient — use when you only iterate once)
total = sum(n**2 for n in range(1_000_000))`,
      lang: "python",
      note: "Generator expressions are crucial for large datasets — they don't materialise the whole list in memory. In an AI pipeline processing millions of text chunks, swapping a list comprehension for a generator expression can cut peak memory usage significantly.",
    },
    {
      title: "Type hints + mypy",
      explain:
        "Python is dynamically typed, but since Python 3.5 you can annotate variables, function parameters, and return types. These hints are ignored at runtime but enable editors and tools like mypy (a static type checker) to catch bugs. In 2026, type hints are standard in professional Python — FastAPI uses them to power its entire validation layer. The syntax is similar to TypeScript: `name: str`, `def fn(x: int) -> str:`.",
      code: `from typing import Optional
# Python 3.10+ shorthand: X | Y instead of Optional[X]

def greet(name: str, times: int = 1) -> str:
    return (f"Hello {name}! " * times).strip()

# complex types
from typing import TypedDict, list as List  # list[...] works in 3.9+

class UserDict(TypedDict):
    id: int
    name: str
    tags: list[str]

def get_user(user_id: int) -> UserDict | None:
    ...  # ellipsis is a valid placeholder (like TODO)

# run: mypy main.py --strict
# common: pip install mypy`,
      lang: "python",
      note: "FastAPI reads type hints at startup to build the JSON schema for every endpoint automatically — your annotations are not just documentation, they drive runtime validation. This is why type hints in Python AI codebases are non-negotiable, not optional.",
    },
    {
      title: "Virtual environments & dependency management",
      explain:
        "A virtual environment (venv) is an isolated Python installation for one project — like `node_modules` but for the whole Python interpreter. Without it, every project shares one global Python and packages conflict. The modern fast option is `uv` (written in Rust, 10–100x faster than pip). `pyproject.toml` is the Python equivalent of `package.json`.",
      code: `# ── classic approach (always works) ──
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\\Scripts\\activate
pip install fastapi uvicorn
pip freeze > requirements.txt

# ── modern approach with uv (recommended 2025+) ──
pip install uv
uv init my-project             # creates pyproject.toml
cd my-project
uv add fastapi uvicorn pydantic
uv run python main.py          # runs inside the venv automatically

# pyproject.toml (uv/poetry)
# [project]
# name = "my-project"
# dependencies = ["fastapi>=0.115", "pydantic>=2.7"]`,
      lang: "bash",
      note: "In Docker, a virtual env is less necessary (the container is already isolated), but using one inside Docker still avoids accidentally installing into the system Python. In CI, `uv` dramatically speeds up dependency installation — from 30s to under 3s for a typical FastAPI project.",
    },
    {
      title: "async/await + asyncio",
      explain:
        "Python's `async/await` works like JavaScript's: an `async def` function returns a coroutine, `await` suspends it until a result is ready, and the event loop runs everything. The key difference: Python has one event loop (via `asyncio`) and you must not block it with synchronous I/O (like `requests` or `time.sleep`). Use `httpx` instead of `requests`, `asyncpg` instead of psycopg2, and `anyio.sleep` instead of `time.sleep`.",
      code: `import asyncio
import httpx

async def fetch_user(user_id: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()

async def fetch_all(ids: list[int]) -> list[dict]:
    # run concurrently — like Promise.all()
    tasks = [fetch_user(uid) for uid in ids]
    return await asyncio.gather(*tasks)

# entry point
asyncio.run(fetch_all([1, 2, 3]))`,
      lang: "python",
      note: "asyncio concurrency is cooperative (single-threaded), not parallel. It only helps I/O-bound work — waiting for a database, an HTTP call, or an LLM response. CPU-heavy work (numpy, tokenization) still blocks the event loop and must be offloaded to a thread pool via `asyncio.run_in_executor` or handled in a separate worker process.",
    },
    {
      title: "FastAPI basics — path, query, body params",
      explain:
        "FastAPI is a Python web framework built on Starlette (ASGI) and Pydantic. It reads your function signatures to determine whether a variable is a path param, a query param, or a request body — you rarely write boilerplate parsing code. Automatic OpenAPI docs are generated at `/docs` (Swagger) and `/redoc`. It is the most-starred Python web framework on GitHub and the default choice for AI backends.",
      code: `from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel

app = FastAPI()

# path parameter — part of the URL
@app.get("/users/{user_id}")
async def get_user(user_id: int):          # FastAPI auto-converts string to int
    if user_id < 1:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user_id, "name": "Alice"}

# query parameter — after the '?'
@app.get("/search")
async def search(q: str, limit: int = Query(default=10, le=100)):
    return {"query": q, "limit": limit}

# body parameter — Pydantic model
class CreateUser(BaseModel):
    name: str
    email: str

@app.post("/users", status_code=201)
async def create_user(body: CreateUser):
    return {"id": 99, **body.model_dump()}`,
      lang: "python",
      note: "FastAPI generates a JSON schema from Pydantic models and enforces it before your handler is called — a malformed body returns a 422 automatically, not a 500. At scale this matters: invalid requests never touch your database, and the auto-generated Swagger UI is what lets frontend devs integrate without back-and-forth.",
    },
    {
      title: "Pydantic v2 models & validation",
      explain:
        "Pydantic is Python's most popular data validation library. You define a class inheriting `BaseModel`, annotate fields with types, and Pydantic validates, coerces, and serialises data automatically. Version 2 (2023+) rewrote the core in Rust — it is ~5–50x faster than v1 and the API changed slightly (`.dict()` → `.model_dump()`, `.json()` → `.model_dump_json()`). FastAPI v0.100+ requires Pydantic v2.",
      code: `from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Annotated

PositiveInt = Annotated[int, Field(gt=0)]

class User(BaseModel):
    id: PositiveInt
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr                     # validates email format
    tags: list[str] = []               # default factory handled automatically

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()

# parse from dict (replaces v1 .parse_obj)
user = User.model_validate({"id": 1, "name": " Alice ", "email": "a@b.com"})
print(user.name)            # "Alice" (stripped)
print(user.model_dump())    # {"id": 1, "name": "Alice", "email": "a@b.com", "tags": []}

# parse from JSON string
user2 = User.model_validate_json('{"id":2,"name":"Bob","email":"b@c.com"}')`,
      lang: "python",
      note: "Pydantic v2's Rust core is fast enough to use it on every hot path, including per-token streaming validation. In RAG pipelines, define a Pydantic model for your LLM's structured output — you get validation, serialisation to/from JSON, and OpenAPI schema generation all for free from the same class.",
    },
    {
      title: "Dependency injection in FastAPI",
      explain:
        "FastAPI has a first-class DI system via `Depends()`. You write a function (the dependency) that can itself have parameters, and FastAPI resolves the whole chain for you. This is how you share a DB connection pool, inject an authenticated user, rate-limit, or inject any service — without passing it explicitly through every function. It is analogous to NestJS providers but built on function signatures.",
      code: `from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = creds.credentials
    # decode / verify JWT here — raise if invalid
    if token != "valid-token":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return {"user_id": 1, "role": "admin"}

# DB session dependency (example with SQLAlchemy async)
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")

async def get_db() -> AsyncSession:
    async with AsyncSession(engine) as session:
        yield session          # yield makes it a context manager dep

@app.get("/profile")
async def profile(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return {"user": user}`,
      lang: "python",
      note: "FastAPI caches dependencies scoped to a single request by default — the DB session is opened once and reused across all `Depends(get_db)` in that request chain, then cleaned up automatically. This gives you connection pooling without any manual lifecycle management.",
    },
    {
      title: "Serving an LLM call with streaming",
      explain:
        "LLM APIs (OpenAI, Anthropic, etc.) support server-sent events (SSE) for streaming token-by-token responses. FastAPI supports this via `StreamingResponse` with an async generator. The client (browser or another service) receives tokens as they arrive instead of waiting for the full response — essential for chat UI responsiveness. The pattern is: call the LLM with `stream=True`, yield each chunk, and wrap in `StreamingResponse`.",
      code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import AsyncOpenAI
import json

app = FastAPI()
client = AsyncOpenAI()   # reads OPENAI_API_KEY from env

async def token_stream(prompt: str):
    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        stream=True,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            # SSE format: "data: <payload>\\n\\n"
            yield f"data: {json.dumps({'token': delta})}\\n\\n"
    yield "data: [DONE]\\n\\n"

class PromptBody(BaseModel):
    prompt: str

@app.post("/chat/stream")
async def chat_stream(body: PromptBody):
    return StreamingResponse(
        token_stream(body.prompt),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )`,
      lang: "python",
      note: "Set `X-Accel-Buffering: no` when running behind Nginx — otherwise Nginx buffers the entire response and streaming is broken. For production, also add a timeout on the LLM call and handle `asyncio.TimeoutError` so a hung LLM call doesn't leak the connection indefinitely.",
    },
    {
      title: "Background tasks",
      explain:
        "FastAPI's `BackgroundTasks` lets you run a function after the response is sent — the endpoint returns immediately and the work happens in the background. This is perfect for sending emails, logging analytics, triggering a webhook, or kicking off a slow job without making the user wait. For heavier work, use a real task queue (Celery + Redis or ARQ) — BackgroundTasks run in the same process and do not survive restarts.",
      code: `from fastapi import BackgroundTasks
import httpx

async def send_webhook(url: str, payload: dict) -> None:
    async with httpx.AsyncClient() as client:
        try:
            await client.post(url, json=payload, timeout=10)
        except Exception:
            pass   # log, retry with a real queue in prod

class OrderBody(BaseModel):
    item: str
    webhook_url: str

@app.post("/orders")
async def create_order(body: OrderBody, bg: BackgroundTasks):
    order_id = "ord_123"
    # fire-and-forget after response is sent
    bg.add_task(send_webhook, body.webhook_url, {"order_id": order_id})
    return {"order_id": order_id, "status": "created"}`,
      lang: "python",
      note: "BackgroundTasks are fire-and-forget with no retry or persistence. If the server restarts while the task is running, it is lost. For AI pipelines (document ingestion, embedding generation), use ARQ or Celery so tasks survive restarts and can be retried with backoff.",
    },
    {
      title: "Error handling & HTTPException",
      explain:
        "FastAPI automatically returns a 422 for validation errors. For application errors (not found, unauthorised, conflict), raise `HTTPException`. For global patterns, use exception handlers registered on the app — they catch exceptions anywhere in the request lifecycle. Consistent error response shapes (`{detail: string}` or a richer object) are a contract with your frontend and API consumers.",
      code: `from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI()

# custom exception class
class NotFoundException(Exception):
    def __init__(self, resource: str, id: int):
        self.resource = resource
        self.id = id

@app.exception_handler(NotFoundException)
async def not_found_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": f"{exc.resource} with id {exc.id} not found"},
    )

# override default 422 shape
@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    item = None   # DB lookup here
    if item is None:
        raise NotFoundException("Item", item_id)
    return item`,
      lang: "python",
      note: "In production, never leak internal exception messages or stack traces to the client. Use a global handler to log the full error (with a trace ID) and return a sanitised message. Structured logging with trace IDs is what lets you correlate a user-facing error to a specific log line in Datadog or CloudWatch.",
    },
    {
      title: "Testing with pytest",
      explain:
        "pytest is the standard Python test runner. FastAPI provides `TestClient` (synchronous, backed by httpx) and `AsyncClient` for async tests. Tests are plain functions starting with `test_`; fixtures (like `client` or `db`) are injected as parameters. pytest's fixture system is more powerful than Jest's `beforeEach` — fixtures can be scoped to function, module, or session and can be async.",
      code: `# test_main.py
import pytest
from httpx import AsyncClient, ASGITransport
from main import app

# async test with httpx (no real server needed)
@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/users", json={"name": "Alice", "email": "a@b.com"}
        )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Alice"

# fixture — override the DB dep for tests
from fastapi.testclient import TestClient

def fake_db():
    yield {"mock": "session"}

app.dependency_overrides[get_db] = fake_db
sync_client = TestClient(app)

def test_profile_requires_auth():
    res = sync_client.get("/profile")
    assert res.status_code == 403   # or 401 depending on your scheme`,
      lang: "python",
      note: "Use `dependency_overrides` to swap out the real DB, LLM client, or any external service in tests — this is the correct FastAPI pattern, equivalent to Jest mocking. For integration tests, use a real test database in Docker (via pytest-docker or testcontainers-python) that is spun up per test session.",
    },
    {
      title: "Uvicorn, ASGI, and running for production",
      explain:
        "FastAPI is an ASGI app — it needs an ASGI server to run. Uvicorn is the standard choice (asyncio-based, very fast). For production: run multiple Uvicorn workers behind Gunicorn (the `uvicorn.workers.UvicornWorker` class), or run multiple Uvicorn processes behind a reverse proxy (Nginx or a cloud load balancer). The `--reload` flag restarts on code change — for development only. In Docker, use `CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]`.",
      code: `# development
uvicorn main:app --reload --port 8000

# production with multiple workers (CPU-bound scaling)
gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4 --bind 0.0.0.0:8000

# or: uvicorn directly with multiple workers (simpler in containers)
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000

# Dockerfile snippet
# FROM python:3.12-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY . .
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      lang: "bash",
      note: "The worker count rule of thumb is `2 * CPU_cores + 1`. However, because Python's GIL prevents true CPU parallelism across threads, horizontal scaling (multiple containers) is usually preferred over many workers in one container for AI workloads where each request is I/O-heavy (LLM calls). Use `--workers 1` per container and scale containers horizontally.",
    },
  ],
  interviewQs: [
    {
      q: "What is the GIL and how does it affect Python concurrency?",
      a: "The Global Interpreter Lock (GIL) is a mutex in CPython that allows only one thread to execute Python bytecode at a time, even on multi-core hardware. This means CPU-bound tasks (sorting, computing) do not benefit from threading. I/O-bound tasks are fine because the GIL is released while waiting for I/O. For CPU parallelism, use `multiprocessing` (separate processes, each with their own GIL) or write the hot path in a C extension. `asyncio` sidesteps the GIL entirely because it is single-threaded cooperative concurrency.",
    },
    {
      q: "What's the difference between a list and a tuple in Python?",
      a: "Both are ordered sequences. A list is mutable — you can append, remove, and modify elements. A tuple is immutable — once created it cannot change. Tuples are slightly faster, use less memory, and can be used as dict keys or set members (because they are hashable, assuming their elements are). Use tuples for fixed collections of heterogeneous items (like a record: `(id, name, score)`) and lists for homogeneous collections you'll mutate.",
    },
    {
      q: "Explain *args and **kwargs.",
      a: "`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict. They allow a function to accept any number of arguments without specifying them upfront. FastAPI uses `**kwargs`-style unpacking heavily internally. Common use: `def log(msg: str, *args, **kwargs)` where you pass format arguments without predefining them. The `*` and `**` operators also unpack: `fn(*my_list)` expands the list as positional args.",
    },
    {
      q: "How do decorators work in Python?",
      a: "A decorator is a function that takes a function and returns a new function — it wraps the original to add behaviour before or after. `@app.get('/users')` is syntactic sugar for `get_user = app.get('/users')(get_user)`. Decorators are used for route registration, authentication, caching, logging, and retry logic. The `@functools.wraps(func)` call inside a decorator preserves the original function's name and docstring, which matters for FastAPI's schema generation.",
    },
    {
      q: "Why is FastAPI fast, and how does it compare to Flask/Django?",
      a: "FastAPI is fast for two reasons: it runs on Uvicorn (an ASGI server using uvloop, which is ~2–4x faster than Node's event loop), and it uses Pydantic v2 (Rust-based validation). Flask and Django are WSGI — synchronous, one-thread-per-request — so they cannot do true async I/O without threads. FastAPI's async endpoints handle thousands of concurrent connections in a single process by yielding while waiting for I/O. Django has async views since 3.1 but the ORM is still mostly synchronous.",
    },
    {
      q: "What is the difference between async and threading in Python for a FastAPI backend?",
      a: "Async (`async def`) is single-threaded cooperative concurrency — great for many concurrent I/O operations (LLM calls, DB queries) with low memory overhead. Threading is OS-thread-based — subject to the GIL for CPU work, but useful for calling blocking sync libraries (like `requests`) without blocking the event loop, via `asyncio.run_in_executor`. In FastAPI, declare endpoints `async def` for async work; for sync-heavy code FastAPI will run the function in a thread pool automatically when you use plain `def`.",
    },
    {
      q: "What is Pydantic and why does FastAPI use it?",
      a: "Pydantic is a data validation library that enforces types and constraints at runtime using Python type hints. FastAPI uses it to automatically parse and validate request bodies, query parameters, and path parameters, and to serialize response models. It also generates the JSON Schema that powers the automatic OpenAPI docs. Pydantic v2's Rust core makes this validation fast enough to add negligible overhead even on high-throughput endpoints.",
    },
    {
      q: "How would you stream an LLM response from a FastAPI endpoint to a browser?",
      a: "Return a `StreamingResponse` with `media_type=\"text/event-stream\"` and an async generator that yields SSE-formatted strings (`data: {...}\\n\\n`). Call the LLM API with `stream=True` and iterate over the chunks with `async for`. On the frontend, consume it with the `EventSource` API or `fetch` with `ReadableStream`. Set `X-Accel-Buffering: no` in the response headers when running behind Nginx, and add timeouts to prevent hung connections.",
    },
    {
      q: "What is dependency injection in FastAPI and how does it help testing?",
      a: "FastAPI's `Depends()` system resolves a dependency function before calling the route handler, injecting its return value as a parameter. Dependencies can themselves depend on other dependencies — FastAPI builds the full graph. For testing, `app.dependency_overrides` lets you replace any dependency (DB session, auth, LLM client) with a fake, without changing production code. This is the correct way to unit test FastAPI routes without hitting real infrastructure.",
    },
    {
      q: "What is ASGI and why does it matter?",
      a: "ASGI (Asynchronous Server Gateway Interface) is the Python standard for async web servers and apps — the async successor to WSGI. An ASGI server (Uvicorn) passes requests to an ASGI app (FastAPI/Starlette) via an async interface, allowing thousands of concurrent connections without threads. WSGI (Flask, classic Django) handles one request per thread synchronously. ASGI is required for WebSockets, SSE (streaming), and long-polling — all common in AI product UIs.",
    },
    {
      q: "How do virtual environments and dependency locking work in Python?",
      a: "A virtual environment is an isolated Python installation per project — like `node_modules` but for the interpreter itself. `requirements.txt` (or `pyproject.toml` with `uv.lock`/`poetry.lock`) pins exact versions for reproducible installs. The lockfile is the equivalent of `package-lock.json`. Always commit the lockfile; never commit the venv directory itself. In Docker, copy and install from the lockfile first (before copying source code) to maximise layer caching.",
    },
  ],
  build: [
    "Build a FastAPI CRUD API for a 'notes' resource: POST/GET/PATCH/DELETE with Pydantic v2 models, async SQLAlchemy with SQLite, and full pytest coverage using dependency_overrides to swap the DB.",
    "Build a streaming LLM chat endpoint: POST /chat/stream that accepts a message, calls an OpenAI-compatible API with stream=True, and returns SSE tokens; add a React frontend that renders tokens as they arrive using fetch + ReadableStream.",
    "Build a document ingestion background pipeline: POST /ingest accepts a file URL, returns a job ID immediately, and uses BackgroundTasks to download the file, chunk it, embed each chunk with a real embeddings API, and store results in a dict in memory (later swap for a real vector DB).",
    "Convert an existing Express.js REST API to Python + FastAPI: replicate every route with proper type hints, Pydantic request/response models, HTTPException error handling, and a mypy --strict clean codebase.",
  ],
  pitfalls: [
    "Calling synchronous blocking I/O (the `requests` library, `time.sleep`, synchronous ORM queries) inside an `async def` endpoint — this blocks the entire event loop, killing concurrency. Always use async equivalents: `httpx.AsyncClient`, `asyncio.sleep`, `asyncpg` or SQLAlchemy async.",
    "Mutable default arguments: `def fn(data=[])` — the list is created once at function definition and shared across all calls. Use `def fn(data=None)` and `data = data or []` inside the function, or `def fn(data: list = Field(default_factory=list))` in Pydantic.",
    "Skipping virtual environments and installing packages globally — one project's dependency update breaks another. Always activate a venv or use `uv run`; add `.venv/` to `.gitignore`.",
    "Ignoring type hints or running without mypy — Python will not error on wrong types at runtime until a crash happens in production. Enable `mypy --strict` in CI from day one to catch errors early.",
    "Using Pydantic v1 patterns (`.dict()`, `.json()`, `@validator`) in a v2 codebase — they are deprecated and removed in v2. Use `.model_dump()`, `.model_dump_json()`, and `@field_validator` respectively.",
  ],
  resources: [
    { label: "FastAPI official docs", url: "https://fastapi.tiangolo.com/" },
    { label: "Pydantic v2 docs", url: "https://docs.pydantic.dev/latest/" },
    { label: "Python asyncio docs", url: "https://docs.python.org/3/library/asyncio.html" },
    { label: "uv — fast Python package manager", url: "https://docs.astral.sh/uv/" },
    { label: "Real Python — FastAPI tutorial", url: "https://realpython.com/fastapi-python-web-apis/" },
    { label: "mypy — static type checker", url: "https://mypy.readthedocs.io/en/stable/" },
  ],
  checklist: [
    "Explain the GIL and when to use async vs threading vs multiprocessing",
    "Write a FastAPI endpoint with path, query, and body params; validate with Pydantic v2",
    "Add type hints to a module and run mypy --strict with zero errors",
    "Create a dependency-injected auth guard and override it in tests",
    "Stream an LLM response token-by-token via SSE from a FastAPI endpoint",
    "Write pytest tests for a CRUD API using dependency_overrides for the DB",
    "Set up a project with uv, pyproject.toml, and a lockfile",
    "Explain why calling requests.get() inside async def is dangerous and how to fix it",
    "Run FastAPI with uvicorn in a Docker container with the correct CMD",
  ],
};
