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
    let id = req.params.id;
    let reqBody = { status: status };
    reqBody.email = req.headers["email"];
    let data = await TaskModel.findByIdAndUpdate({ _id: id }, reqBody, {
      new: true,
    });
    await data.save();
    res.status(200).json({ message: "Success update task", data: data });
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

exports.SearchByKeyword = async (req, res) => {
  try {
    let email = req.headers.email;
    console.log(email);
    let SearchRgx = { $regex: req.params.keyword, $options: "i" };
    let SearchQuery = {
      $or: [{ title: SearchRgx }, { description: SearchRgx }],
    };
    let matchStage = { $match: SearchQuery };
    let authMatchStage = { $match: { email: email } };
    console.log(authMatchStage);
    // let projection = { $project: { _id: 0 } };

    let data = await TaskModel.aggregate([authMatchStage, matchStage]);

    res.status(200).json({ status: true, data: data });
  } catch (e) {
    res.status(200).json({ status: false, e });
  }
};

// exports.SearchByKeyword = async (req, res) => {
//   try {
//     const email = req.headers["email"];
//     const searchRgx = new RegExp(req.params.keyword, "i");
//     const searchQuery = {
//       $or: [
//         { title: { $regex: searchRgx } },
//         { description: { $regex: searchRgx } },
//       ],
//     };
//     const matchStage = { $match: searchQuery };
//     const authMatchStage = { $match: { email: email } };

//     const data = await TaskModel.aggregate([authMatchStage, matchStage]);

//     res.status(200).json({ status: true, data: data });
//   } catch (error) {
//     res.status(500).json({ status: false, error: error.message });
//   }
// };
