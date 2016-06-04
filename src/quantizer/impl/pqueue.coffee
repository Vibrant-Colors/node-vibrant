module.exports =
class PQueue
  constructor: (@comparator) ->
    @contents = []
    @sorted = false

  _sort: ->
    @contents.sort(@comparator)
    @sorted = true

  push: (o) ->
    @contents.push o
    @sorted = false

  peek: (index) ->
    if not @sorted
      @_sort()
    index ?= @contents.length - 1
    @contents[index]

  pop: ->
    if not @sorted
      @_sort()
    @contents.pop()

  size: ->
    @contents.length

  map: (f) ->
    if not @sorted
      @_sort()
    @contents.map(f)
