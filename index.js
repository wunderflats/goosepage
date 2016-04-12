'use strict';

var goosepage = (cursor, opts) => {
  var defaults = { itemsPerPage: 20, page: 0};
  opts = Object.assign(defaults, goosepage.defaults, opts);

  var query = cursor._conditions;
  var Model = cursor.model;
  var page = opts.page;
  var itemsPerPage = opts.itemsPerPage;

  return getTotalNumberOfResults().then(fetchAndAggregate);

  function getTotalNumberOfResults() {
    return Model.count(query);
  }

  function fetchAndAggregate(count) {
    return cursor
      .skip(page * itemsPerPage)
      .limit(itemsPerPage)
      .exec()
      .then((items) => ({
        total: count,
        page: page,
        itemsPerPage: itemsPerPage,
        items: items
      }));
  }
};

goosepage.defaults = {
  itemsPerPage: 20,
  page: 0
};

module.exports = goosepage;
