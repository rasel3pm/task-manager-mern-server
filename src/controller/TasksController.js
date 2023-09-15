const TaskModel = require("../model/TaskModel");

exports.CreateTask = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.email = req.headers["email"];
    let data = await TaskModel.create(reqBody);
    if (data) {
      res.status(200).json({ status: "Success", data: data });
    } else {
      res.status(200).json({ status: "Fail" });
    }
  } catch (error) {
    res.status(200).json({ status: "Fail", data: error });
  }
};
//delete task by Id
exports.DeleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const data = await TaskModel.findByIdAndDelete({ _id: taskId });
    if (data) {
      res.status(200).json({ message: "Success delete task" });
    }
  } catch (err) {
    res.status(200).json({ message: "task not delete", err: err });
  }
};

exports.UpdateTask = async (req, res) => {
  try {
    let status = req.params.status;
    reqBody.email = req.headers["email"];
    let reqBody = { status: status };
    let data = await TaskModel.findByIdAndUpdate({ _id: taskId }, reqBody, {
      new: true,
    });
    await data.save();
    res.status(200).json({ message: "Success update task", data });
  } catch (err) {
    res.status(200).json({ status: "faild", err });
  }
};

exports.ListTaskByStatus = async (req, res) => {
  try {
    let status = req.params.status;
    let email = req.headers["email"];
    let data = await TaskModel.aggregate([
      { $match: { email: email, status: status } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdDate: {
            $dateToString: {
              date: "$createdDate",
              format: "%d-%m-%Y",
            },
          },
        },
      },
    ]);
    res.status(200).json({ message: "Success", data: data });
  } catch (err) {
    res.status(200).json({ status: "faild", err });
  }
};

exports.TaskStatusCount = async (req, res) => {
  try {
    let email = req.headers["email"];
    let data = await TaskModel.aggregate([
      { $match: { email: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ]);
    res.status(200).json({ message: "Success", data: data });
  } catch (err) {
    res.status(200).json({ status: "faild", err });
  }
};
