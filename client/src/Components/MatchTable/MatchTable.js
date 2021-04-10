import React, {useState} from 'react';
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


  const cancelMatch = (matchId) => {
    axios.get(`http://localhost:3001/cancel-match?id=${matchId}`).
    then((response) => {
      if(response.data["matchCanceled"] == true) {
        setIsCanceled(true);
        window.location.reload(false);
      }
    });
  }

  const matchs = props.matchs;
  const matchsLength = matchs.length;
  const [matchCanceled, setIsCanceled] = useState(false);

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} id="myTable" aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Match ID</StyledTableCell>
            <StyledTableCell align="center">Match Date</StyledTableCell>
            <StyledTableCell align="center">Match Start Time</StyledTableCell>
            <StyledTableCell align="center">Match End Time</StyledTableCell>
            <StyledTableCell align="center">Cancel Match</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (matchsLength > 0) ? matchs.map((match) => (
            <StyledTableRow key={match['user_id']} >
              <StyledTableCell component="th" scope="row">
                {match['match_id']}
              </StyledTableCell>
              <StyledTableCell align="center">{match['match_date']}</StyledTableCell>
              <StyledTableCell align="center">{match['match_start_time']}</StyledTableCell>
              <StyledTableCell align="center">{match['match_end_time']}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton onClick={() => cancelMatch(match['match_id'])}  style={{padding: '0px'}}>
                  <DeleteForeverIcon
                  fontSize="large" 
                  color="error" 
                  />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          )): <StyledTableRow> <StyledTableCell>No upcoming matchs</StyledTableCell> </StyledTableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
