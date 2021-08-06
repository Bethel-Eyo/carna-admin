import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import GridItem from "components/Grid/GridItem.js";
import axios from "axios";
import Domain from "Constants/Keys";
import { getAccessToken } from "helpers/Utils";
import moment from "moment";
import Button from "components/CustomButtons/Button.js";
import { Modal } from "react-bootstrap";
import TextField from "@material-ui/core/TextField";

const styles = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative",
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px",
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function CoursesPage() {
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [courseId, setCourseId] = useState(null);

  const handleClose = () => setShow(false);
  const handleCloseCreate = () => setShowCreate(false);
  const handleCloseDel = () => setShowDel(false);
  const handleShow = () => setShow(true);

  const handleShowDel = (course) => {
    setCourseId(course.course_id);
    setTitle(course.title);
    setShowDel(true);
  };
  const handleShowCreate = () => setShowCreate(true);

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAccessToken(),
    };

    axios
      .get(Domain + "/admin/get-all-courses", { headers })
      .then((res) => {
        // alert("Succes");
        setCourses(res.data);
      })
      .catch((err) => {
        alert(err.message);
        console.log(err.message);
      });
  };

  const updateCourse = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAccessToken(),
    };

    let data = {
      title,
      description,
      course_id: courseId,
    };

    axios
      .put(Domain + "/admin/update-course", data, { headers })
      .then((res) => {
        alert("Course updated successfuly");
        console.log(res.data);
        handleClose();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
        handleClose();
      });
  };

  const createCourse = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAccessToken(),
    };

    let data = {
      title,
      description,
    };

    axios
      .post(Domain + "/admin/create-course", data, { headers })
      .then((res) => {
        alert("Course created successfuly");
        console.log(res.data);
        handleClose();
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
        console.log(err.message);
        handleClose();
      });
  };

  const editCourse = (course) => {
    setTitle(course.title);
    setDescription(course.description);
    setCourseId(course.course_id);
    handleShow();
  };

  const deleteCourse = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getAccessToken(),
    };

    axios
      .delete(Domain + `/admin/delete-course/${courseId}`, { headers })
      .then((res) => {
        alert("User Deleted Successfuly");
        console.log(res.data);
        handleCloseDel();
        window.location.reload();
      })
      .catch((err) => {
        alert(err.message);
        console.log(err.message);
        handleCloseDel();
      });
  };

  // this handles the onchange in the input fields
  const handleChange = (text) => ({ target: { value } }) => {
    if (text == "title") {
      setTitle(value);
    } else if (text == "description") {
      setDescription(value);
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Carna Courses</h4>
            <p className={classes.cardCategoryWhite}>
              The list of courses offered by carna are listed below
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={[
                "ID",
                "title",
                "description",
                "Date Created",
                "Actions",
              ]}
              tableData={courses.map((course, index) => [
                course.course_id,
                course.title,
                course.description,
                moment(course.createdat).format("MMM Do YY"),
                <div key={index}>
                  <Button color="primary" onClick={() => editCourse(course)}>
                    Edit
                  </Button>
                  <Button color="danger" onClick={() => handleShowDel(course)}>
                    Delete
                  </Button>
                </div>,
              ])}
            />
            <Button color="primary" onClick={handleShowCreate}>
              Create New user
            </Button>

            {/* Modal for the Edit Functionality */}
            <Modal show={show} size="lg" onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit course with title: {title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <TextField
                  id="name"
                  label="Title"
                  variant="outlined"
                  style={{ width: "30%", marginRight: "5%" }}
                  onChange={handleChange("title")}
                  value={title}
                />
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  style={{ width: "60%", marginRight: "5%" }}
                  onChange={handleChange("description")}
                  value={description}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  color="danger"
                  variant="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="primary"
                  onClick={updateCourse}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for the Create Functionality */}
            <Modal show={showCreate} size="lg" onHide={handleCloseCreate}>
              <Modal.Header closeButton>
                <Modal.Title>Create new Course</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <TextField
                  id="title"
                  label="Title"
                  variant="outlined"
                  style={{ width: "30%", marginRight: "5%" }}
                  onChange={handleChange("title")}
                  value={title}
                />
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  style={{ width: "60%", marginRight: "5%" }}
                  onChange={handleChange("description")}
                  value={description}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  color="danger"
                  variant="secondary"
                  onClick={handleCloseCreate}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  variant="primary"
                  onClick={createCourse}
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal for the Delete Functionality */}
            <Modal show={showDel} onHide={handleCloseDel}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Course</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete course with title: {title}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDel}>
                  Close
                </Button>
                <Button variant="primary" onClick={deleteCourse}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
