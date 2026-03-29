import anthropic
import subprocess
import threading
import sys
import itertools
import time

diff_output = subprocess.run(
    ["git", "diff"],
    capture_output=True,
    text=True,
).stdout

client = anthropic.Anthropic()

stop_spinner = threading.Event()

def spin():
    #icons = "|/-\\"
    icons = "🤔💭🧐⏰💡🤨👀🤖🤓😵‍💫🧠"
    for frame in itertools.cycle(icons):
        if stop_spinner.is_set():
            break
        sys.stdout.write(f"\r{frame}...")
        # sys.stdout.write(f"\r{frame} Generating commit message...")
        sys.stdout.flush()
        time.sleep(0.1)
    sys.stdout.write("\r" + " " * 40 + "\r")
    sys.stdout.flush()

spinner_thread = threading.Thread(target=spin)
spinner_thread.start()

message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1000,
    messages=[
        {
            "role": "user",
            "content": "Can you write a one line commit message for the following git diff? " + diff_output,
        }
    ],
)

stop_spinner.set()
spinner_thread.join()

msg = message.content[0].text.strip().split("\n")[0]

diff_output = subprocess.run(
    ["git", "add", "--all"],
).stdout

diff_output = subprocess.run(
    ["git", "commit", "-m", msg],
).stdout

print(msg)