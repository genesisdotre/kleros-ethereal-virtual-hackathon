app.service('utils', function($q) {
    let service = {};
  
    function str2ab(str) { // https://github.com/dy/string-to-arraybuffer/blob/804d870138371bbdde7d3b2e738f0a0f822c6d3d/index.js#L22-L28
      var array = new Uint8Array(str.length);
      for(var i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
      }
      return array.buffer
    }
  
    service.uploadToIPFS = function(json) {
      let defer = $q.defer();
  
      let toString = JSON.stringify(json);
  
      let toArrayBuffer = str2ab(toString);
  
      let toBuffer = buffer.Buffer(toArrayBuffer);
    
      ipfs.add(toBuffer, (err, result) => {
        if (err) { console.error(err); defer.reject(err); }
        console.log("https://gateway.ipfs.io/ipfs/" + result[0].hash,  result);
        defer.resolve(result[0].hash);
      });
  
      return defer.promise;
    }
  
    return service;
});