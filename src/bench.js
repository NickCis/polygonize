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
 * complex: 35.348ms
 * cutedge: 0.725ms
 * dangle: 0.166ms
 * geometry-collection-two-polygons: 0.455ms
 * kinked-linestring: 0.240ms
 * linestrings: 0.200ms
 * multi-linestring: 1.657ms
 * two-polygons: 0.293ms
 */
for (const {name, geojson} of fixtures) {
  console.time(name);
  polygonize(geojson);
  console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * complex x 68.00 ops/sec ±1.09% (69 runs sampled)
 * cutedge x 10,170 ops/sec ±1.65% (87 runs sampled)
 * dangle x 20,439 ops/sec ±0.74% (89 runs sampled)
 * geometry-collection-two-polygons x 14,530 ops/sec ±1.26% (89 runs sampled)
 * kinked-linestring x 17,258 ops/sec ±1.04% (91 runs sampled)
 * linestrings x 11,036 ops/sec ±0.56% (90 runs sampled)
 * multi-linestring x 20,942 ops/sec ±1.26% (91 runs sampled)
 * two-polygons x 14,522 ops/sec ±1.32% (91 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-polygonize');
for (const {name, geojson} of fixtures) {
  suite.add(name, () => polygonize(geojson));
}

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
