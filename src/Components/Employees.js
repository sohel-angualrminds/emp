import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar';
import { green } from '@mui/material/colors';
import { getDataFromLocalStorage, putDataToLocalStorage } from '../Service/Service';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


let color = [green];


function Employees() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([])

    const getDataTo = (res) => {
        let res2 = res.map(({ id, name, email, mobileNumber }, index) => {
            return (
                {
                    id: id,
                    Name: name,
                    Email: email,
                    Phone: mobileNumber
                }
            )

        })
        return res2;
    }



    const deleteData = (params) => {
        let nres = rows.filter((item) => item.id !== params.id)
        putDataToLocalStorage("employeedata", nres);
        setRows(nres);
    }

    const gotoUpdate = (row) => {
        console.log(row);
        navigate(`/employees/UPDATE/${row.id}`, { replace: true })
    }

    const columns = [
        {
            field: 'Avatar ', headerName: 'Avatar',
        },
        { field: 'Name', headerName: 'Name..', },
        { field: 'Email', headerName: 'Email', },
        {
            field: 'Phone',
            headerName: 'Phone',
        },
        {
            field: 'Actions',
            headerName: 'Actions',
        }
    ];



    useEffect(() => {
        async function get() {
            let res = await getDataFromLocalStorage("employeedata");
            res = res ? res : [];
            const res2 = getDataTo(res);
            setRows(res2);
        }
        get();
    }, [])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.headerName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        <TableCell>
                                            <Avatar sx={{
                                                bgcolor: color[0][500]
                                            }}>
                                                {
                                                    `${row.Name.split('')[0].toUpperCase()}`
                                                    // 'A'
                                                }
                                            </Avatar >
                                        </TableCell>
                                        <TableCell>{row.Name}</TableCell>
                                        <TableCell>{row.Email}</TableCell>
                                        <TableCell>{row.Phone}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="Edit" key={row.id}>
                                                    <IconButton
                                                        onClick={() => { gotoUpdate(row) }}
                                                    >
                                                        <ModeEditOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => {
                                                            deleteData(row);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>

                                        </TableCell>
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ToastContainer />
        </Paper>
    );
}
export default Employees
