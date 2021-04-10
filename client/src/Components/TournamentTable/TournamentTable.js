import React, {useState, useEffect} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import axios from 'axios';
import {Howl} from 'howler';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const useStyles = makeStyles({
  table: {
    width: '100%'
  },
});

export default function CustomizedTables(props) {

  const cancelMatch = (tournamentId) => {
    axios.get(`http://localhost:3001/cancel-tournament?id=${tournamentId}`).
    then((response) => {
      if(response.data["tournamentCanceled"] == true) {
        setIsCanceled(true);
        window.location.reload(false);
      }
    });
  }

  const tournaments = props.tournaments;
  const tournamentsLength = tournaments.length;
  const [tournamentCanceled, setIsCanceled] = useState(false);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} id="myTable" aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Tournament ID</StyledTableCell>
            <StyledTableCell align="center">Tournament Date</StyledTableCell>
            <StyledTableCell align="center">Tournament Start Time</StyledTableCell>
            <StyledTableCell align="center">Tournament End Time</StyledTableCell>
            <StyledTableCell align="center">Cancel Tournament</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (tournamentsLength > 0) ? tournaments.map((match) => (
            <StyledTableRow key={match['user_id']} >
              <StyledTableCell component="th" scope="row">
                {match['tournament_id']}
              </StyledTableCell>
              <StyledTableCell align="center">{match['tournament_date']}</StyledTableCell>
              <StyledTableCell align="center">{match['tournament_start_time']}</StyledTableCell>
              <StyledTableCell align="center">{match['tournament_end_time']}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton onClick={() => cancelMatch(match['tournament_id'])}  style={{padding: '0px'}}>
                  <DeleteForeverIcon
                  fontSize="large" 
                  color="error" 
                  />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          )): <StyledTableRow> <StyledTableCell>No upcoming tournaments</StyledTableCell> </StyledTableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
