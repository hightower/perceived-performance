# perceived-performance
An angular module for assisting with determining perceived page load times.

Adapted from http://code.mendhak.com/angular-performance/

# Usage
## Directives
* `performance` :  Add to the top level element of the page that you want to instrument.
  
  #### attributes
  * `performance` : (optional) The name of your state. It uses `$state.current` if left empty.
  * `performance-url` : (required) The endpoint that will be posted to once all child `performance-loaded` attributes
  have finished loading.
- `performance-loaded` : Add below `performance` to various elements that should be loaded before the page is perceived to be loaded.
  
  #### attributes
  * `performance-loaded` : (required) An expression that is truthy when the associated content is loaded.

## Example
```html
<body performance performance-url="/metrics_endpoint">
  <section performance-loaded="ctrl.contentLoaded()">
    ...main content...
  </section>
  <section performance-loaded="ctrl.commentsLoaded()">
    ...comments...
  </section>
</body
```

Once `ctrl.contentLoaded()` and `ctrl.commentsLoaded()` evaluate to truthy values, the `performance` directive will
`POST` the following data to the endpoint provided by `performance-url`:
```json
{
 "name": "stateName", 
 "initial": "inital page load time before angular code being executing",
 "content": "time from when performance directive was rendered to when all content was loaded"
}
```
