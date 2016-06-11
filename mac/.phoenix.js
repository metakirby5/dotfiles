#!/usr/bin/env coffee -p

# Constants
MOD = ['cmd', 'alt']
GRAV_MOD = ['cmd', 'alt', 'shift']
SIZE_MOD = ['cmd', 'ctrl']
UNIT = 50
GAP = 10
APPS = {
  Terminal: 't'
}

NORTH = 'NORTH'
SOUTH = 'SOUTH'
EAST = 'EAST'
WEST = 'WEST'

# Aliases
fw = Window.focusedWindow

# Handlers
keys = []
events = []

# Keybinds
for app, key of APPS
  keys.push Phoenix.bind key, MOD, -> App.launch(app).focus()

# Select
keys.push Phoenix.bind 'h', MOD, -> fw().focusClosestWindowInWest()
keys.push Phoenix.bind 'j', MOD, -> fw().focusClosestWindowInSouth()
keys.push Phoenix.bind 'k', MOD, -> fw().focusClosestWindowInNorth()
keys.push Phoenix.bind 'l', MOD, -> fw().focusClosestWindowInEast()

# Size
Window::resize = (dx, dy) ->
  tFrame = @frame()
  tFrame.width += dx
  tFrame.height += dy
  @setFrame(tFrame)

keys.push Phoenix.bind 'h', SIZE_MOD, -> fw().resize(-UNIT, 0)
keys.push Phoenix.bind 'j', SIZE_MOD, -> fw().resize(0, UNIT)
keys.push Phoenix.bind 'k', SIZE_MOD, -> fw().resize(0, -UNIT)
keys.push Phoenix.bind 'l', SIZE_MOD, -> fw().resize(UNIT, 0)

# Gravity
Window::fallTo = (dir) ->
  windows = switch dir
    when NORTH then @windowsToNorth()
    when SOUTH then @windowsToSouth()
    when EAST then @windowsToEast()
    when WEST then @windowsToWest()
  tFrame = @frame()
  myEdge = switch dir
    when NORTH then tFrame.y
    when SOUTH then tFrame.y + tFrame.height
    when EAST then tFrame.x + tFrame.width
    when WEST then tFrame.x
  tScreen = Screen.mainScreen().visibleFrameInRectangle()
  closest = switch dir
    when NORTH then tScreen.y + GAP
    when SOUTH then tScreen.y + tScreen.height - GAP
    when EAST then tScreen.x + tScreen.width - GAP
    when WEST then tScreen.x + GAP
  edgeOf = (f) ->
    switch dir
      when NORTH then f.y + f.height + GAP
      when SOUTH then f.y - GAP
      when EAST then f.x - GAP
      when WEST then f.x + f.width + GAP
  catchable = (f) ->
    switch dir
      when NORTH, SOUTH
        tFrame.x < f.x + f.width and tFrame.x + tFrame.width > f.x
      when EAST, WEST
        tFrame.y < f.y + f.height and tFrame.y + tFrame.height > f.y
  fallable = (a, b) ->
    switch dir
      when NORTH, WEST then a - 1 > b
      when SOUTH, EAST then a + 1 < b

  # Find the closest window we can fall to
  for win in windows
    f = win.frame()
    edge = edgeOf f
    # If I can fall to it and it can fall to closest so far
    if catchable(f) and fallable(myEdge, edge) and fallable(edge, closest)
      closest = edge

  # Set our frame
  switch dir
    when NORTH then tFrame.y = closest
    when SOUTH then tFrame.y = closest - tFrame.height
    when EAST then tFrame.x = closest - tFrame.width
    when WEST then tFrame.x = closest

  @setFrame(tFrame)

keys.push Phoenix.bind 'h', GRAV_MOD, -> fw().fallTo(WEST)
keys.push Phoenix.bind 'j', GRAV_MOD, -> fw().fallTo(SOUTH)
keys.push Phoenix.bind 'k', GRAV_MOD, -> fw().fallTo(NORTH)
keys.push Phoenix.bind 'l', GRAV_MOD, -> fw().fallTo(EAST)
