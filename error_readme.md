## Common Errors and Troubleshooting

### ERROR 1: Command errored out with exit status 1: (Error for installation of confluent_kafka library )
   command: /home/user/myenv/bin/python3 -u -c 'import sys, setuptools, tokenize; sys.argv[0] = '"'"'/tmp/pip-install-efvsecow/confluent-kafka/setup.py'"'"'; __file__='"'"'/tmp/pip-install-efvsecow/confluent-kafka/setup.py'"'"';f=getattr(tokenize, '"'"'open'"'"', open)(__file__);code=f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' bdist_wheel -d /tmp/pip-wheel-islerzmm
       cwd: /tmp/pip-install-efvsecow/confluent-kafka/
  Complete output (6 lines):
  usage: setup.py [global_opts] cmd1 [cmd1_opts] [cmd2 [cmd2_opts] ...]
     or: setup.py --help [cmd1 cmd2 ...]
     or: setup.py --help-commands
     or: setup.py cmd --help
  
  error: invalid command 'bdist_wheel'
  ----------------------------------------
  ERROR: Failed building wheel for confluent-kafka
  Running setup.py clean for confluent-kafka
Failed to build confluent-kafka
Installing collected packages: confluent-kafka
    Running setup.py install for confluent-kafka ... error

## Solution: install req packages
          sudo apt-get install -y librdkafka-dev
          
          pip install wheel
