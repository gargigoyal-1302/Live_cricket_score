import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import Navbar from "./components/Navbar";
import axios from "axios";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function App() {
  const [matches, setMatches] = useState([]);
  const url = `https://cricapi.com/api/matches/?apikey=${process.env.REACT_APP_API_KEY}
  `;

  /// API CALL
  useEffect(() => {
    getMatches();
  }, [matches]);

  const getMatches = () => {
    axios
      .get(url)
      .then((res) => {
        setMatches(res.data.matches);
        console.log(matches);
      })
      .catch((error) => alert("unable to load data"));
  };

  // function to display raw data using dialog box
  const [open, setOpen] = React.useState(false);
  const [selectedMatchDetails, setSelectedMatchDetails] = useState("");
  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedMatchDetails(row);
  };
  const handleClose = () => {
    setOpen(false);
  };

  ///// handle show details
  const renderButton = (row) => {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleClickOpen(row)}
        >
          Show Details
        </Button>
      </div>
    );
  };

  const columns = [
    {
      Header: "Team -1",
      accessor: "team-1",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Team-2",
      accessor: "team-2",
      sortable: true,
      filterable: true,
    },
    {
      Header: "Date and Time",
      accessor: "dateTimeGMT",
      filterable: false,
    },

    {
      Header: "Show Details",
      sortable: false,
      filterable: false,
      Cell: (row) => {
        return renderButton(row.original);
      },
    },
  ];

  return (
    <div className="App">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedMatchDetails["team-1"] +
            " Vs " +
            selectedMatchDetails["team-2"]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Start time :
              {new Date(selectedMatchDetails.dateTimeGMT).toLocaleString()}
            </p>
            {selectedMatchDetails.matchStarted ? (
              <p>
                Toss Win By : {selectedMatchDetails.toss_winner_team}
                <br />
                Winner Team : {selectedMatchDetails.winner_team}
              </p>
            ) : (
              <h2>Match has not started yet !!</h2>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Navbar />
      <h1 className="heading">Welcome to my live score app</h1>
      <Grid container>
        <Grid sm={1}></Grid>
        <Grid sm={10}>
          {/* react table for displaying data */}
          <ReactTable
            columns={columns}
            noDataText="Please Wait"
            showPageSizeOptions={false}
            defaultPageSize={20}
            data={matches}
            filterable
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
