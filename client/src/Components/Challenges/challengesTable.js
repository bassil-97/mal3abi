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
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';

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
  wrapper: {
      width: '70%'
  }
});

export default function CustomizedTables(props) {

  const challenges = props.challenges;
  const challengesLength = challenges.length;
  const [challengeRequested, setIsRequested] = useState(false);

  const classes = useStyles();

  const requestChallenge = (challengeId, opponentId) => {
    axios.get(`http://localhost:3001/request-challenge?id=${challengeId}&userId=${opponentId}`).
    then((response) => {
      if(response.data["challengeRequested"] == true) {
        setIsRequested(true);
        window.location.reload(false);
      }
    });
  }

  return (
    <TableContainer component={Paper} className={classes.wrapper}>
      <Table className={classes.table} id="myTable" aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Challenge ID</StyledTableCell>
            <StyledTableCell align="center">Challenge Title</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Challenge Now!</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            (challengesLength > 0) ? challenges.map((challenge) => (
            <StyledTableRow key={challenge['challenge_id']} >
              <StyledTableCell component="th" scope="row">
                {challenge['challenge_id']}
              </StyledTableCell>
              <StyledTableCell align="center">{challenge['challengeTitle']}</StyledTableCell>
              <StyledTableCell align="center" style={{color: 'green', fontWeight: 'bold'}}>{challenge['challengeStatus']}</StyledTableCell>
              <StyledTableCell align="center"><Button
                                                 variant="contained" 
                                                 color="default" 
                                                 onClick={() => requestChallenge(challenge['challenge_id'], challenge['firstTeamLeader'])}
                                                 startIcon={<AddCircleOutlineIcon />}>Challenge</Button></StyledTableCell>
            </StyledTableRow>
          )): <StyledTableRow align="center"> <StyledTableCell>No opponents are available</StyledTableCell> </StyledTableRow>}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
