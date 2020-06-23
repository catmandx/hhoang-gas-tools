
var CachePro_ = function(cacheName,expirationInSeconds,propertiesService_) {
    this.id;
    this.log = false;
    this.name = "cache-"+cacheName;
    this.expirationInSeconds = expirationInSeconds || (60 * 60); // default cache 3600s
    this.propertiesService = propertiesService_;
  }
  
  
  CachePro_.prototype.reset = function() {
   var keys = this.propertiesService.getKeys();
    for (var i in keys) {
      if (keys[i].indexOf("cache-") > -1) {
        var obj = JSON.parse( this.propertiesService.getProperty(keys[i]) );
        var file = DriveApp.getFileById(obj.fileId);
        DriveApp.removeFile(file)
        this.propertiesService.deleteProperty(keys[i]);
        if (this.log) Logger.log("Deleted %s", keys[i]);
      }
      
    }
  }
  
  
  
  CachePro_.prototype.setLog = function() {
    this.log = true;
    return this;
  }
  
  CachePro_.prototype.init = function(file) {
        this.id = file.getId();
        var date = (new Date()).getTime() + (this.expirationInSeconds * 1000);
        var json = JSON.stringify({ expiredDate : date, fileId : this.id });
        this.propertiesService.setProperty(this.name, json);
  }
  
  
  
  CachePro_.prototype.getData = function(function_) {
        var properties = this.propertiesService.getProperty(this.name);
              
        if (properties === null) {
              if (this.log) Logger.log("Fetch fresh data to  %s and new cache file is created", this.name);
              var content = function_();
              var file = DriveApp.createFile(this.name, content);
              this.init(file); 
              return file.getBlob();
        } else {
              var obj = JSON.parse(properties);
              var remain = Math.round((new Date(+obj.expiredDate) - new Date()) / 1000);
              
              if (remain > 0) {
                    if (this.log) Logger.log("Load data from cache %s , which will expire in %s seconds", this.name,remain);
                    try {
                        var file = DriveApp.getFileById(obj.fileId);
                    } catch (e) {
                        var content = function_();
                        var file = DriveApp.createFile(this.name, content);
                        this.init(file);
                    }
                    return file.getBlob();
            } else {
                  if (this.log) Logger.log("Fetch fresh data to %s and rewrite cache file", this.name);
                  var content = function_();
                  try {
                        var file = DriveApp.getFileById(obj.fileId);
                        file.setContent(content);  
                  } catch (e) {
                        var file = DriveApp.createFile(this.name, content);
                  }
            this.init(file);
            return file.getBlob();
            }
        }
  }
  
  
  
  /**
  * Caching content into static Drive files
  *
  * @param {String} cacheName The cache name, which have to be unique like ID for Properties, Cache and File name
  * @param {Number} expirationInSeconds How long cache will be in memory
  * @param {PropertiesService} propertiesService Insert which type Properties Service do you want to use (User / Document / Script)
  
  * @return {Blob} Returns Binary large object
  */
  function cache(cacheName,expirationInSeconds,propertiesService) {
    return new CachePro_(cacheName,expirationInSeconds,propertiesService);
  }
  
  
  
  
  