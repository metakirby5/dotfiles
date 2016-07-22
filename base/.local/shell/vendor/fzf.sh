if which fzf &>/dev/null; then
  # Show hidden files
  export FZF_DEFAULT_COMMAND='\
    git ls-tree -r --name-only HEAD 2>/dev/null ||\
    ag --hidden -l 2>/dev/null ||\
    find -L . 2>/dev/null | cut -c3-'
  export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

  # Color scheme and file preview
  export FZF_DEFAULT_OPTS="\
    --color=fg:7,bg:-1,hl:3,fg+:7,bg+:-1,hl+:3,info:2,prompt:4,pointer:3,marker:2,spinner:0,header:5\
    --preview='(x={}; x=\"\${x/#\~/$HOME}\"; pygmentize \"\$x\" || cat \"\$x\") 2>/dev/null'\
    --bind=ctrl-o:toggle-preview"
  export FZF_CTRL_T_OPTS="$FZF_DEFAULT_OPTS"
  export FZF_CTRL_R_OPTS="$FZF_DEFAULT_OPTS --preview="
  export FZF_ALT_C_OPTS="$FZF_DEFAULT_OPTS --preview="

  # Auto-completion
  [[ $- == *i* ]] && source "/usr/local/opt/fzf/shell/completion.bash" 2> /dev/null

  # Key bindings
  set -o vi
  source "/usr/local/opt/fzf/shell/key-bindings.bash"
fi