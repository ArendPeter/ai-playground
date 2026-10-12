### How to install this?
### 
### I aliased this this to gc in my command line here's my bash rc
### 
### ``` 
###    gc(){
###         python /c/w/ai-playground/smart_commit.py "$1"
###    }
### ```
### 
### How to use this?
### 
### So `gc "blah blah"`` is the equivalent of `git commit -m "blah blah"``, but doing just `gc` will use ai to generate the message for you
### 

import subprocess
import threading
import sys
import time
import random
import os
import shutil
from dotenv import load_dotenv
load_dotenv()

# Windows consoles default to cp1252, which can't print the emoji spinner
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

### Git Commands
subprocess.run(
    ["git", "add", "--all"],
    capture_output=True,
)

if len(sys.argv) > 1 and sys.argv[1] != '':
    msg = sys.argv[1]
else:
    ### Check CLI
    if shutil.which("claude") is None:
        sys.exit("claude CLI not found on PATH. Install Claude Code, then run `claude setup-token` and put CLAUDE_CODE_OAUTH_TOKEN in .env.")

    ### Spinnner
    stop_spinner = threading.Event()

    def spin():
        icons = "🤔💭🧐⏰💡🤨👀🤖🤓😵‍💫🧠"
        while True:
            if stop_spinner.is_set():
                break
            sys.stdout.write(f"\r    {random.choice(icons)}")
            sys.stdout.flush()
            time.sleep(0.5)
        sys.stdout.write("\r" + " " * 40 + "\r")
        sys.stdout.flush()

    spinner_thread = threading.Thread(target=spin, daemon=True)
    spinner_thread.start()

    diff_output = subprocess.run(
        ["git", "diff", '--cached'],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    ).stdout

    ### AI Stuff
    prompt = (
        "Write a git commit message under 80 characters for the diff on stdin. "
        "Concisely describe the main change; it's okay to skip minor aspects. "
        "Reply with only the message, no quotes or explanation."
    )

    # An API key in the environment would take precedence over the subscription token
    env = {k: v for k, v in os.environ.items() if k not in ("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN")}

    try:
        # Diff goes via stdin to stay under Windows' command-line length limit
        claude_result = subprocess.run(
            ["claude", "-p", prompt, "--model", "sonnet"],
            input=diff_output,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            env=env,
        )
    finally:
        stop_spinner.set()
        spinner_thread.join()

    if claude_result.returncode != 0:
        sys.exit(f"claude failed:\n{claude_result.stdout}{claude_result.stderr}")

    msg = claude_result.stdout.strip().split("\n")[0]
    if not msg:
        sys.exit("claude returned an empty commit message")

    print(msg)

result = subprocess.run(
    ["git", "commit", "-m", msg],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
)
if result.returncode != 0:
    print(result.stdout, end="")
    print(result.stderr, end="", file=sys.stderr)
sys.exit(result.returncode)
