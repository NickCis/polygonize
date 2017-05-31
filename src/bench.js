const fs = require('fs');
const path = require('path');
const load = require('load-json-file');
const Benchmark = require('benchmark');
const polygonize = require('./');

const directory = path.join(__dirname, '..', 'test', 'in') + path.sep;
const fixtures = fs.readdirSync(directory).map(filename => {
  return {
    name: path.parse(filename).name,
    geojson: load.sync(directory + filename)
  };
});


/**
 * Single Process Benchmark
 *
 * complex: 36.156ms
 * cutedge: 0.800ms
 * dangle: 0.197ms
 * geometry-collection-two-polygons: 0.383ms
 * two-polygons: 0.351ms
 */
for (const {name, geojson} of fixtures) {
  console.time(name);
  polygonize(geojson);
  console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * complex x 68.02 ops/sec ±1.02% (69 runs sampled)
 * cutedge x 5,033 ops/sec ±1.32% (91 runs sampled)
 * dangle x 8,929 ops/sec ±0.58% (91 runs sampled)
 * geometry-collection-two-polygons x 14,109 ops/sec ±1.07% (90 runs sampled)
 * two-polygons x 14,100 ops/sec ±1.13% (89 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-polygonize');
for (const {name, geojson} of fixtures) {
  suite.add(name, () => polygonize(geojson));
}

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
