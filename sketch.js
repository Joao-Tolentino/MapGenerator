// Definition for terrain types.
class TerrainType {
    constructor(minHeight, maxHeight, minColor, maxColor, lerpFactor = 0) {
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.minColor = minColor;
        this.maxColor = maxColor;
        // Lerp factor to control the blending between min and max colors based on height.
        this.lerpFactor = lerpFactor;
    }
}

// Variables/Parameters
  let mapWidth = screen.width; // Gets the screen max height and width.
  let mapHeight = screen.height;
  let noiseScale = 0.1;
  let zoomFactor = 100;
  let xOffset = 1000;
  let yOffset = 1000;
  let waterTerrain;
  let sandyTerrain;
  let grassyTerrain;
  let deepForestTerrain;
  let snowyMountainTerrain;

// Setup of the base map.
function setup() {
  createCanvas(mapWidth, mapHeight);

  // Use several octaves of noise to create more detailed and varied terrain.
  noiseDetail(10, 0.5);

  // Define the Terrain Types with thresholds and colors.
  // Perlin noise min and max is usually in 0.2 -> 0.75~0.8;
  waterTerrain = 
  new TerrainType(0.2, 0.4, color(30, 176, 251), color(40, 255, 255));
  sandyTerrain = 
  new TerrainType(0.4, 0.45, color(255, 210, 0), color(255, 255, 11), 0.3);
  grassyTerrain =
  new TerrainType(0.4, 0.6, color(110, 255, 50), color(80, 210, 110));
  deepForestTerrain =
  new TerrainType(0.6, 0.7, color(0, 200, 0), color(0, 110, 0), -0.5);
  snowyMountainTerrain =
  new TerrainType(0.7, 0.75, color(0, 10, 0), color(255, 255, 255), 0.4);

  noLoop();
}

// Definition of the map properties, terrain and water levels.
function draw(){
  // Loop through each pixel of the canvas and paint the corresponding terrain.
  for(let x=0; x < mapWidth; x++){
    for(let y=0; y < mapHeight; y++){
      //Set xVal and yVal for the noise such that the map is centered around the center of the canvas.
      const xVal = (x - width / 2) / zoomFactor + xOffset;
      const yVal = (y - height / 2) / zoomFactor + yOffset;
      const noiseValue = noise(xVal, yVal);

      // Paint the map according to the terrain type.
      let terrainColor;
      if (noiseValue < waterTerrain.maxHeight) {
        terrainColor = getTerrainColor(waterTerrain, noiseValue);
      } else if (noiseValue < sandyTerrain.maxHeight) {
        terrainColor = getTerrainColor(sandyTerrain, noiseValue);
      } else if (noiseValue < grassyTerrain.maxHeight) {
        terrainColor = getTerrainColor(grassyTerrain, noiseValue);
      } else if (noiseValue < deepForestTerrain.maxHeight) {
        terrainColor = getTerrainColor(deepForestTerrain, noiseValue);
      } else {
        terrainColor = getTerrainColor(snowyMountainTerrain, noiseValue);
      }
      set(x, y, terrainColor);
    }
  }
  // Generate Points of interest and connections between them.
  PointsOfInterest();

  // Update the canvas with the generated map.
  updatePixels();
}

// Function to calculate the  color of the terrain using gradient.
function getTerrainColor(terrainType, noiseValue) {
  // Normalize the noise value to a range between 0 and 1 based on the terrain type's min and max heights.
  const normalized = normalize(noiseValue, terrainType.minHeight, terrainType.maxHeight);

  // Blend in the  color and return the result.
  return lerpColor(terrainType.minColor, terrainType.maxColor, normalized + terrainType.lerpFactor);
}

// Normalization function
function normalize(value, min, max) {
  if( value > max) return 1;
  if( value < min) return 0;    
  return (value - min) / (max - min);
}

// Function to get the terrain type of a x,y coordinate
function getTerrainType(x, y){
  // Recompute the noise to get the terrain type.
  const xVal = (x - width / 2) / zoomFactor + xOffset;
  const yVal = (y - height / 2) / zoomFactor + yOffset;
  const noiseValue = noise(xVal, yVal);

  // Find the terrain and return the type itself.
  if (noiseValue < waterTerrain.maxHeight) {
    return "water";
  } 
  else if (noiseValue < sandyTerrain.maxHeight) {
    return "sand";
  } 
  else if (noiseValue < grassyTerrain.maxHeight) {
    return "grass";
  } 
  else if (noiseValue < deepForestTerrain.maxHeight) {
    return "forest";
  } 
  else {
    return "mountain";
  }
}

// Function to define the diferent points of interest on the map
function PointsOfInterest() {
  // Ammount of points of interest in the map.
  let ammount = 25;

  // Arrays that save the random points coordinates for painting later.
  let xCoordinates = [];
  let yCoordinates = [];

  // Seed the random with date to get different results every time.
  randomSeed(Date.now());
  
  //Generate random different x,y pairs.
  for (let i = 0; i < ammount; i++){
    // Get a random coordinate and append to the array, each pair will be treated as x,y coordinates.
    xCoordinates[i] = Math.floor(Math.random() * (mapWidth - 1));
    yCoordinates[i] = Math.floor(Math.random() * (mapHeight - 1));
  }

  // Set a dot in a random position on the map using the coordinates generated above.
  for(let point = 0; point < ammount; point++){
    let xCoord = xCoordinates[point];
    let yCoord = yCoordinates[point];
    let terrainType = getTerrainType(xCoord, yCoord);
    // Separate by terrain type categories and add a black 6x6 square, in the future use name generator to add a label;
    switch(terrainType) {
      case 'water':
        // Name a Lake, river, ocean, waterfall.
        for(let x=xCoord-3; x<xCoord+3; x++){
          for(let y=yCoord-3; y<yCoord+3; y++){
            set(x, y, color(0,0,0));
          }
        }
        break;
      case 'sand':
        // Name a port, desert, village/city/farm, shipwreck.
        for(let x=xCoord-3; x<xCoord+3; x++){
          for(let y=yCoord-3; y<yCoord+3; y++){
            set(x, y, color(0,0,0));
          }
        }
        break;
      case 'grass':
        // Name a castle/village/farm/city, a bridge/monument, ruins.
        for(let x=xCoord-3; x<xCoord+3; x++){
          for(let y=yCoord-3; y<yCoord+3; y++){
            set(x, y, color(0,0,0));
          }
        }
        break;
      case 'forest':
        // Name a hidden camp/cave/dungeon/ruins, a rare tree/flower/animal.
        for(let x=xCoord-3; x<xCoord+3; x++){
          for(let y=yCoord-3; y<yCoord+3; y++){
            set(x, y, color(0,0,0));
          }
        }
        break;
      case 'mountain':
        // Name a mountain/volcano/cave, a hidden temple/ruins.
        for(let x=xCoord-3; x<xCoord+3; x++){
          for(let y=yCoord-3; y<yCoord+3; y++){
            set(x, y, color(0,0,0));
          }
        }
        break;
      default:
        // Do nothing and keep the program running.
        break;
    }
  }
}
