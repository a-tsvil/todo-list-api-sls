const contentTypeJson = {
  'Content-Type': 'application/json; charset=utf-8',
};

function okJson(obj) {
  return {
    statusCode: 200,
    body: JSON.stringify(obj, null, 2),
    headers: {
      ...contentTypeJson,
    },
  };
}

function badRequestJson(obj) {
  return {
    statusCode: 400,
    body: JSON.stringify(obj, null, 2),
    headers: {
      ...contentTypeJson,
    },
  };
}

module.exports = {
  okJson,
  badRequestJson,
};
