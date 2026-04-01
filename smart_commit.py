import anthropic
import subprocess
import threading
import sys
import itertools
import time
import random
import os
from dotenv import load_dotenv
load_dotenv() 

### Git Commands
subprocess.run(
    ["git", "add", "--all"],
    capture_output=True,
)

if len(sys.argv) > 1 and sys.argv[1] != '':
    msg = sys.argv[1]
else:
    ### Check Key
    if os.getenv('SMART_COMMIT_API_KEY') is None:
        raise Exception("SMART_COMMIT_API_KEY environment variable is not set. Please set it to your Anthropic API key.")

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
    ).stdout

    ### AI Stuff
    client = anthropic.Anthropic(
        api_key=os.getenv('SMART_COMMIT_API_KEY')
    )

    try:
        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": "Can you write commit message in less than 80 characters from a git diff? The message should consisely describe the main feature of the diff, it's okay to skip minor aspects. Here's the diff: " + diff_output,
                }
            ],
        )
    finally:
        stop_spinner.set()
        spinner_thread.join()

    msg = message.content[0].text.strip().split("\n")[0]

    print(msg)

subprocess.run(
    ["git", "commit", "-m", msg],
    capture_output=True,
)
