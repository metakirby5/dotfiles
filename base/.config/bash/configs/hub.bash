if command -v hub &>/dev/null; then
  alias git='hub'
  export GIT_COMMAND='hub'
fi
