import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';

const columns = [
  { id: 'CIF', label: 'CIF', minWidth: 170  },
  { id: 'NAME', label: 'Name', minWidth: 100 },
  {
    id: 'ACCOUNT_NUMBER',
    label: 'Account Number',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'STATE',
    label: 'State',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'COUNTRY',
    label: 'Country',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

const rows = [];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 200,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const existArray=[];
  if (JSON.parse(localStorage.getItem("searchResult")) !== "no results found") {
    Object.entries(JSON.parse(localStorage.getItem("searchResult"))).map(([index, value]) => {
        
        var obj = value;
        if(!existArray.includes(value.CIF)){
          existArray.push(value.CIF);
        rows.push(obj);
        console.log(obj.cif);
        }
        
     
       
    });
   
} else {
  rows=[];
}
// existArray=[];

const clickRow = (e) => {
  console.log(e);
  axios({
      method: 'post',
      url: "http://18.221.237.209:5000/cifdetails",
      headers: { 'Content-Type': 'application/json' },
      data: {
        // "country":String (e.target.textContent)
        "cif" : e
      }
    }).then(function (response) {
      const data = response.data.response;
       localStorage.setItem('bankDetails', JSON.stringify(data.bankDetails));
       localStorage.setItem('carePackageDetails', JSON.stringify(data.carePackageDetails));
       localStorage.setItem('negativeSpendingTrend', JSON.stringify(data.negativeSpendingTrend));
       localStorage.setItem('podTrend', JSON.stringify(data.podTrend));
       localStorage.setItem('predictedGamblingData', JSON.stringify(data.predictedGamblingData));
       localStorage.setItem('spendingDetails', JSON.stringify(data.spendingDetails));
       localStorage.setItem('carePackageDetails', JSON.stringify(data.carePackageDetails));
       localStorage.setItem('spendingToEarningRatio', JSON.stringify(data.spendingToEarningRatio));
       localStorage.setItem('customerDetails', JSON.stringify(data.customerDetails));
       window.location.pathname="/searchResult";
    })
  .catch((error) => {
      console.log(error);
  });

};
  // for(let i=0;i<4;i++){
  //   rows.push({CIF:1,NAME:'Bipil',ACCOUNT_NUMBER:123,STATE:'m',COUNTRY:'INDIA'});
  // }
  return (
    <Paper className={classes.root} >
      <TableContainer className={classes.container} >
        <Table stickyHeader aria-label="sticky table table-striped table-hover">
          <TableHead >
            <TableRow >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth,backgroundColor:'rgba(212,228,239,1)',fontWeight:'bold',fontSize:'16px' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow onClick={(e) => clickRow(row['CIF'])} hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} style={{fontWeight:'bold'}}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
