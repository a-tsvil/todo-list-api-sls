const AWS = require("aws-sdk");

const { badRequestJson, okJson } = require("./utils");

const ddb = new AWS.DynamoDB.DocumentClient();

const TableName = "todoTable";

module.exports.get = async (event) => {
  try {
    const result = await ddb
      .scan({
        TableName,
      })
      .promise();

    return okJson(result.Items);
  } catch (error) {
    console.error(error);
    return badRequestJson({
      error: "Error occurred during To-Do objects retrieval",
    });
  }
};

module.exports.put = async (event) => {
  let Item;
  try {
    Item = JSON.parse(event.body);
    if (!Item.id) throw new Error("'id' field is missing");
    if (!Item.title) throw new Error("'title' field is missing");
    if (!Item.description) throw new Error("'description' field is missing");
  } catch (error) {
    return badRequestJson({ message: error.message });
  }

  try {
    await ddb
      .put({
        TableName,
        Item,
      })
      .promise();
    return okJson({ message: "To-Do object successfully created" });
  } catch (error) {
    return badRequestJson({
      message: "Error occurred while creating To-Do object",
    });
  }
};
