import * as React from 'react';
import { useState, useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';
import Container from '@mui/material/Container';
import { DataGrid } from '@mui/x-data-grid';
import { getDataFromLocalStorage, putDataToLocalStorage } from '../Service/Service';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
let color = [deepOrange, deepPurple];

function Employees() {
    const [rows, setRows] = useState([])

    const getDataTo = (res) => {
        let res2 = res.map(({ name, email, mobileNumber }, index) => {
            return (
                {
                    id: index,
                    Name: name,
                    Email: email,
                    Phone: mobileNumber
                }
            )

        })
        return res2;
    }



    const deleteData = (params) => {
        let nres = rows.filter((item) => item.id !== params.row.id)
        putDataToLocalStorage("employeedata", nres);
        setRows(nres);
    }

    const columns = [
        {
            field: 'Avatar ', headerName: 'Avatar', width: 70, renderCell: (params) => {
                return (
                    <Avatar sx={{
                        bgcolor: color[0][500]
                    }}>
                        {
                            `${params.row.Name.split('')[0].toUpperCase()}`
                            // 'A'
                        }
                    </Avatar >
                )
            }
        },
        { field: 'Name', headerName: 'Name..', width: 130 },
        { field: 'Email', headerName: 'Email', width: 180 },
        {
            field: 'Phone',
            headerName: 'Phone',
            type: 'number',
            width: 190,
        },
        {
            field: 'Actions',
            headerName: 'Actions',
            type: 'String',
            sortable: false,
            width: 110,
            renderCell: (params) => {
                // console.log(params);
                return (
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit" key={params.id}>
                            <IconButton
                                onClick={() => { }}
                            >
                                <ModeEditOutlineIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                onClick={() => {
                                    deleteData(params);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>)
            }
        },
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params) =>
        //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        // },
    ];



    useEffect(() => {
        async function get() {
            let res = await getDataFromLocalStorage("employeedata");
            res = res ? res : [];

            const res2 = getDataTo(res)
            setRows(res2);
        }
        get();
    }, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ my: 9 }}>
                <Box sx={{ bgcolor: 'white', height: '100vh' }} >
                    <div style={{ height: 400, }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            // checkboxSelection
                            disableSelectionOnClick
                        />
                    </div>
                </Box>
            </Container>
        </React.Fragment>
    );
}
export default Employees
