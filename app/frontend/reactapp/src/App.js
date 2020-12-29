import React from 'react';
import logo from './logo.svg';
import './App.css';

import axios from "axios";

import { decode } from 'he';

import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import Container from '@material-ui/core/Container';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { makeStyles, useTheme } from '@material-ui/core/styles';

function setRowClass(item) {
    let row_class = "row"
    if (item.STATUS == 2) row_class +=" ok";
    if (item.STATUS == 0) row_class +=" new";
    if (item.STATUS == -1) row_class +=" error";
    if (item.STATUS == -2) row_class +=" error";
    if (item.STATUS == 1) row_class +=" update";
    return row_class
}

function update_records(updateRecords) {
    const url = process.env.REACT_APP_API+"/status";
    fetch(url,{method: "GET",})
        .then(response => response.json())
        .then((data) => { updateRecords(data);})
}

function TablePaginationActions(props) {
        const { count, page, rowsPerPage, onChangePage } = props;
        const theme = useTheme();
        const useStyles1 = makeStyles(
                theme => ({
                    root: {
                        flexShrink: 0,
                        marginLeft: theme.spacing(2.5),
                    },
                    DATA: {
                        width: "50%",
                    },
                    MESSAGE: {
                        width: "40%",
                    }
                })
        );
        const classes = useStyles1();

        const handleFirstPageButtonClick = event => {
            onChangePage(event, 0);

        };

        const handleBackButtonClick = event => {
            onChangePage(event, page - 1);
        };

        const handleNextButtonClick = event => {
            onChangePage(event, page + 1);
        };

        const handleLastPageButtonClick = event => {
            onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
        };

        return (
            <div className={classes.root}>
                <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="next page">
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="last page">
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }

let delay = 2000;

function decode_message(msg) {
    var json = JSON.parse(msg)
    var s = "{"
    for (var key in json) {
        s += '"'+key+'"="'+json[key]+'", ';
    };
    return s.slice(0,-2)+"}"
}

export default function CustomTable() {
    const [page, setPage] = React.useState(0);
    const rowsPerPage = 100;
    const [records, setRecords] = React.useState([]);
    const [isFetching, setFetchState] = React.useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleUpdateRecords = () => {
        update_records(setRecords);
        delay = 300000;
    };

    setTimeout(handleUpdateRecords, delay);

    return (
        <Container maxWidth="lg">
            <TableContainer component={Paper}>
                <Table className="" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[rowsPerPage]}
                                colSpan={3}
                                count={records.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(
                            item => (
                                <TableRow key={item.ID} className={setRowClass(item)}>
                                    <TableCell className="ID">{item.ID}</TableCell>
                                    <TableCell className="DATA">{decode_message(item.DATA)}</TableCell>
                                    <TableCell className="MESSAGE">{item.MESSAGE}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

