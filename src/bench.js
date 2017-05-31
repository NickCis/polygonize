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
 * complex: 36.498ms
 * cutedge: 0.817ms
 * dangle: 0.181ms
 * geometry-collection-two-polygons: 0.199ms
 * kinked-linestring: 0.155ms
 * linestrings: 0.207ms
 * multi-linestring: 0.230ms
 * two-polygons: 0.490ms
 */
for (const {name, geojson} of fixtures) {
  console.time(name);
  polygonize(geojson);
  console.timeEnd(name);
}

/**
 * Benchmark Results
 *
 * complex x 67.30 ops/sec ±0.93% (68 runs sampled)
 * cutedge x 9,865 ops/sec ±1.46% (90 runs sampled)
 * dangle x 19,582 ops/sec ±1.05% (89 runs sampled)
 * geometry-collection-two-polygons x 13,700 ops/sec ±1.26% (91 runs sampled)
 * kinked-linestring x 16,706 ops/sec ±1.33% (91 runs sampled)
 * linestrings x 10,652 ops/sec ±0.99% (90 runs sampled)
 * multi-linestring x 20,776 ops/sec ±1.31% (92 runs sampled)
 * two-polygons x 13,752 ops/sec ±1.25% (90 runs sampled)
 */
const suite = new Benchmark.Suite('turf-transform-polygonize');
for (const {name, geojson} of fixtures) {
  suite.add(name, () => polygonize(geojson));
}

suite
  .on('cycle', e => console.log(String(e.target)))
  .on('complete', () => {})
  .run();
