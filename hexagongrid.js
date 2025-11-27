    function buildHexGrid(opts) {
      if (!(this instanceof buildHexGrid)) {
        return new buildHexGrid(opts);
      }
      for (var key in opts) {
        if (opts.hasOwnProperty(key)) {
          this.opts[key] = opts[key];
        }
      }
      this.instance = Math.round(Math.random() * 2000);
      return this.createSVG();
    }
    
    buildHexGrid.prototype = {
      opts: {
        cols: 6,
        rows: 6,
        spacing: 0,
        size: 100,
        offsetX: 0,
        offsetY: 0
      },
      createPolygon: function(size, sides) {
        sides = sides || 6;
        size = size || 140;
        size = size * 0.52;
        var i = sides,
          points = [];
        while (i--) {
          points.push(
            Math.round(size + size * Math.sin(i * (Math.PI * 2) / sides)) + ',' +
            Math.round(size + size * Math.cos(i * (Math.PI * 2) / sides))
          );
        }
        return '<polygon id="hex' + this.instance + '" points="' + points.join(' ') + '"></polygon>';
      },
      createGrid: function() {
        var hex = '<use x="{{x}}" y="{{y}}" fill="{{fill}}" class="hex{{css}} hexitem" xlink:href="#hex' + this.instance + '" />',
          odd = false,
          size = this.opts.size + this.opts.spacing,
          grid = '',
          count = 0,
          x, y, i, j, fill;
        
        for (i = 0; i < this.opts.rows; i++) {
          odd = i % 2;
          y = i * (size * 0.87) + this.opts.offsetY;
          for (j = 0; j < this.opts.cols + (odd ? 1 : 0); j++) {
            x = j * size + (odd ? -size / 2 : 0) + this.opts.offsetX;
            count++;
            
            var fill = '#fff';
            
            grid += hex.replace('{{x}}', x).replace('{{y}}', y).replace('{{fill}}', fill).replace('{{css}}', count);
          }
        }
        return grid;
      },
      createSVG: function() {
        var div = document.createElement('div'),
            size = this.opts.size + this.opts.spacing;
        
        // Create SVG without viewBox to allow it to scale freely
        div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">'       
          + '<defs>' + this.createPolygon(this.opts.size) + '</defs>' 
          + this.createGrid()
          + '</svg>';
        return div.children[0];
      }
    };
    
    // Create a large hexagon grid that extends beyond viewport
    var hexGrid = buildHexGrid({
      cols: 35,      // More columns to extend past edges
      rows: 45,      // More rows to extend past edges
      size: 80,      // Hexagon size
      spacing: -5,
      offsetX: -200, // Negative offset to start off-screen left
      offsetY: -200  // Negative offset to start off-screen top
    });
    
    document.getElementById('hex-grid-container').appendChild(hexGrid);