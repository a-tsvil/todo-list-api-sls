const AWS = require("aws-sdk");

const { badRequestJson, okJson } = require("./utils");

const ddb = new AWS.DynamoDB.DocumentClient();

const TableName = "todoTable";

module.exports.get = async (event) => {
  if (!event.pathParameters.todo_id)
    return badRequestJson({ message: "'todo_id' param is missing" });

  try {
    const result = await ddb
      .get({
        TableName,
        Key: {
          id: event.pathParameters.todo_id,
        },
      })
      .promise();

    return okJson(result.Item);
  } catch (error) {
    console.error(error);
    return badRequestJson({
      message: "Error during To-Do object retrieval",
    });
  }
};

module.exports.put = async (event) => {
  if (!event.pathParameters.todo_id)
    return badRequestJson({ message: "'todo_id' param is missing" });

  let result;
  try {
    result = await ddb
      .get({
        TableName,
        Key: {
          id: event.pathParameters.todo_id,
        },
      })
      .promise();
    if (!result.Item) throw new Error("Item for update was not found");
  } catch (error) {
    return badRequestJson({ message: error.message });
  }

  try {
    const newItem = {
      ...result.Item,
      ...JSON.parse(event.body),
      id: event.pathParameters.todo_id,
    };

    await ddb
      .put({
        TableName,
        Item: newItem,
      })
      .promise();

    return okJson({ message: "To-Do object was updated successfully" });
  } catch (error) {
    console.error(error);
    return badRequestJson({
      error: "Error during To-Do object update occurred",
    });
  }
};

module.exports.delete = async (event) => {
  if (!event.pathParameters.todo_id)
    return badRequestJson({ message: "'todo_id' param is missing" });

  try {
    await ddb
      .delete({
        TableName,
        Key: {
          id: event.pathParameters.todo_id,
        },
      })
      .promise();
    return okJson({ message: "To-Do object deleted successfully" });
  } catch (error) {
    console.error(error);
    return badRequestJson({
      error: "There has been an error while deleting the To-Do object.",
    });
  }
};
