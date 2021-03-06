/* eslint-disable no-console */

'use strict';

const Io = require('legion-io');
const metrics = require('legion-metrics');

module.exports = function(testcase) {
  testcase = Io.of().chain(testcase);

  return Io.get().chain(function(state) {
    const result = testcase.run(state).catch(function(err) {
      console.log(err);
      if( state && state.receive )
        state.receive(metrics.problem(err));
      else
        throw err; // the entire purpose of this function was to report error metrics instead of throwing an error
                   // but apparently we don't have the ability to report any metrics at all, so just burn everything
    });

    return Io.resolve(result);
  });
};
