import subprocess
subprocess.run(["scp", "-r", "-P", "2244", "/Users/jesper/dev/hue-control/client/dist/",
               "jeth@10.0.128.110:/home/jeth/apps/skojj"])

print("Done")

