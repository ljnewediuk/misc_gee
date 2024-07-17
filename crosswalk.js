// Define region around US-Canada border
var borderRegion = 
    ee.Geometry.Polygon(
        [[[-113.75329517496185, 49.191002468465356],
          [-113.75329517496185, 48.787287484174975],
          [-95.25231861246185, 48.787287484174975],
          [-95.25231861246185, 49.191002468465356]]], null, false);

// NLCD land cover
var nlcd = ee.Image("USGS/NLCD/NLCD2011").
select('landcover').
clip(borderRegion);

// AAFC ACI land cover
var aci = ee.Image("AAFC/ACI/2011").
select('landcover').
clip(borderRegion);

// Convert rasters to vectors in border region
var aciVect = aci.reduceToVectors({
  geometry: borderRegion,
  scale: 1000
})
var nlcdVect = nlcd.reduceToVectors({
  geometry: borderRegion,
  scale: 1000
})

// Define intersecting spatial filter
var distFilter = ee.Filter.intersects({
  leftField: '.geo',
  rightField: '.geo',
  maxError: 1
})

// Define saveAll join
var saveAllJoin = ee.Join.saveAll({
  matchesKey: 'landcover'
})

// Apply join
var intersectJoin = saveAllJoin.apply(aciVect, nlcdVect, distFilter)

// Print table
print(intersectJoin)

// Export
Export.table.toDrive({
  'collection': intersectJoin,
  'folder': 'temp'
})
