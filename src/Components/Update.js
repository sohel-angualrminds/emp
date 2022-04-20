import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { getDataFromLocalStorage, getOneData, updateData } from '../Service/Service'
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

let initailData = { gender: "female", name: '', mobileNumber: '', email: '', password: '', address: '', state: '', city: '' };



function Update() {
    let params = useParams();
    let Navigate = useNavigate();
    const [value, setValue] = React.useState('');
    const [sliderValue, setSliderValue] = React.useState(0);
    const [locationData, setLocationData] = useState({ citiesData: [], statesData: [] });
    const [selectedState, setSelectedState] = useState('');
    const [checkbox, setCheckbox] = useState(() => new Array(5).fill(false));
    const [Error, setError] = useState({ name: false, email: { status: false, text: "" }, mobileNumber: { status: false, text: "" } });

    const [FinalObj, setFinalObj] = useState(initailData);

    const submitData = async (e, obj) => {
        e.preventDefault();
        if (Error.name.status === true || Error.mobileNumber.status === true || Error.email.status === true) {
            alert("please provide proper information")
            return;
        }
        let obj1 = {
            ...obj,
            rate: sliderValue,
            checkbox
        }
        await updateData('employeedata', obj1);
        Navigate("/");
        toast.success('Employee Data Updated SuccesFully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setFinalObj(initailData);

    }

    const handleCheckbox = (e) => {
        let check = checkbox;
        check[Number(e.target.id)] = !check[Number(e.target.id)]
        setCheckbox(JSON.parse(JSON.stringify(check)));
    }
    const validate = {
        mobileValidate: (e) => {
            if (e.target.value.length !== 10) {
                setError({
                    ...Error, mobileNumber: {
                        status: true,
                        text: `length of mobile number should be 10 you enter ${e.target.value.length}`
                    }
                })
            }
            else {
                setError({
                    ...Error, mobileNumber: {
                        status: false,
                        text: ``
                    }
                })
            }
        },
        emailValidate(e) {
            if (FinalObj.email === '' || !FinalObj.email.includes('@') || !FinalObj.email.includes('.'))
                setError({ ...Error, email: { status: true, text: 'please include @ and . sign' } })
            else {
                setError({ ...Error, email: { status: false, text: '' } })
            }
        },
        nameValidate(e) {
            if (FinalObj.name.length <= 0) {
                setError({ ...Error, name: { status: true, text: "insert name its required" } })
            } else {
                setError({ ...Error, name: { status: false, text: '' } })
            }
        }
    }

    useEffect(() => {
        const get = async () => {
            const { states, cities } = await getDataFromLocalStorage('locationData');
            let res = await getOneData('employeedata', params.id);
            let s = states.filter(item => item.name === res.state);
            let cres = cities.filter((city) => city.stateCode === s[0].isoCode)

            setLocationData({ statesData: states, citiesData: cres });
            setFinalObj(res);
            setSliderValue(res.rate);
            setCheckbox(res.checkbox)
        }
        if (locationData.statesData.length === 0)
            get();
    }, [])


    useEffect(() => {
        const get = async () => {
            const { states, cities } = await getDataFromLocalStorage('locationData');
            let cres = cities.filter((city) => city.stateCode === selectedState.isoCode)
            // l(cres)
            setLocationData({ statesData: states, citiesData: cres });
            // setFinalObj(res);
        }
        if (selectedState.isoCode)
            get();

    }, [selectedState])


    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setSliderValue(newValue);
            setFinalObj({ ...FinalObj, rate: newValue })

        }
    }


    return (
        <React.Fragment>
            <Container maxWidth="xl" sx={{ bgcolor: 'whitesmoke', display: "flex", justifyContent: "center", overflow: 'hidden' }}
            >
                <Card sx={{ maxWidth: "50%", my: 10, textAlign: 'center', overflow: "auto" }}>
                    <CardHeader
                        subheader="Update Employee Data"
                        sx={{ color: "success", textAlign: "center" }}
                    />
                    <Box
                        component="form"
                        onSubmit={(e) => submitData(e, FinalObj)}
                        sx={{
                            '& > :not(style)': { mx: 4, my: 2 }
                        }}
                    >

                        <TextField
                            id="name"
                            label="Name"
                            color="success"
                            variant="outlined"
                            size="small"
                            value={FinalObj.name}
                            sx={{ width: 300, color: "success" }}
                            error={Error.name.status}
                            helperText={Error.name.text}
                            onChange={(e) => {
                                setFinalObj({ ...FinalObj, name: e.target.value })
                                setError({ ...Error, name: { status: false, text: '' } })
                            }}
                            onBlur={validate.nameValidate}
                            required
                        />


                        <TextField
                            id="email"
                            type="email"
                            label="Email"
                            color="success"
                            variant="outlined"
                            size="small"
                            error={Error.email.status}
                            helperText={Error.email.text}
                            sx={{ width: 300, color: "success" }}
                            value={FinalObj.email}
                            onChange={(e) => {
                                setFinalObj({ ...FinalObj, email: e.target.value })
                                if (!e.target.value.includes('@') || !e.target.value.includes('.'))
                                    setError({ ...Error, email: { status: false, text: 'please include @ and .' } })
                                else {
                                    setError({ ...Error, email: { status: false, text: '' } })
                                }
                            }}
                            onBlur={validate.emailValidate}
                            required
                        />

                        <TextField
                            id="password"
                            type="password"
                            label="password"
                            color="success"
                            variant="outlined"
                            size="small"
                            sx={{ width: 300, color: "success" }}
                            value={FinalObj.password}
                            onChange={(e) => {
                                setFinalObj({ ...FinalObj, password: e.target.value })
                            }}
                        />

                        <TextField
                            id="mobileNumber"
                            label="Mobile Number"
                            type="number"
                            color="success"
                            variant="outlined"
                            size="small"
                            max={10}
                            min={10}
                            sx={{ width: 300, color: "success" }}
                            value={FinalObj.mobileNumber}
                            onChange={(e) => {
                                setFinalObj({ ...FinalObj, mobileNumber: e.target.value })
                                setError({
                                    ...Error, mobileNumber: {
                                        status: false,
                                        text: `length of mobile number should be 10 you enter ${e.target.value.length}`
                                    }
                                })
                            }}
                            error={Error.mobileNumber.status}
                            helperText={Error.mobileNumber.text}
                            onBlur={validate.mobileValidate}
                        />
                        <br />

                        <TextareaAutosize
                            id="address"
                            minRows={4}
                            placeholder="Enter Address"
                            style={{ width: 300 }}
                            value={FinalObj.address}
                            onChange={(e) => {
                                setFinalObj({ ...FinalObj, address: e.target.value })
                            }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                disableFuture
                                openTo="year"
                                views={['day', 'month', 'year']}
                                value={FinalObj.dob}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                    setFinalObj({ ...FinalObj, dob: newValue })
                                }}

                                renderInput={(params) =>
                                    <TextField {...params}
                                        label="Select Birth Date"
                                        color="success"
                                        variant="outlined"
                                        size="small"
                                        sx={{ width: 300, color: "success", outlineColor: "success" }}
                                    />}
                            />
                        </LocalizationProvider>

                        <br />

                        <Box
                            component="div"
                            sx={{ display: "flex" }}
                        >
                            <Autocomplete
                                size="small"
                                color="success"
                                variant="outlined"
                                id="states"
                                options={locationData.statesData}
                                getOptionLabel={(state) => state.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={FinalObj.state ? { name: FinalObj.state } : { name: '' }}
                                onChange={(e, newValue) => {
                                    e.preventDefault();
                                    if (newValue !== null) {
                                        setFinalObj({ ...FinalObj, state: newValue.name })
                                        console.log(newValue);
                                        setSelectedState({ name: newValue.name, isoCode: newValue.isoCode })
                                    }
                                    else {
                                        setFinalObj({ ...FinalObj, state: '' })
                                    };
                                }}
                                renderInput={
                                    (params) => <TextField
                                        color="success"
                                        size="small"
                                        {...params}
                                        id="states"

                                        label="Select State"
                                        sx={{ width: 140, color: "success", ml: 19 }}
                                    />
                                }

                            />
                            <Autocomplete
                                size="small"
                                variant="outlined"
                                id="cities"
                                options={locationData.citiesData}
                                getOptionLabel={(city) => city.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={FinalObj.city ? { name: FinalObj.city } : { name: '' }}
                                onChange={(e, newValue) => {
                                    e.preventDefault();
                                    if (newValue !== null) {
                                        setFinalObj({ ...FinalObj, city: newValue.name })
                                    }
                                    else {
                                        setFinalObj({ ...FinalObj, city: '' })
                                    };
                                }}

                                renderInput={
                                    (params) => <TextField
                                        id="cities"
                                        color="success"
                                        size="small"
                                        {...params}
                                        label="Select City"
                                        sx={{ width: 140, color: "success", ml: 2 }}
                                    />
                                }
                            />

                        </Box>


                        <Stack
                            spacing={4}
                            direction="row"
                        >
                            <Box component="div">

                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={FinalObj.gender}
                                        name="radio-buttons-group"

                                        onChange={(e) => {
                                            setFinalObj({ ...FinalObj, gender: e.target.value })
                                        }}
                                        row
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Box component="div">
                                <FormGroup
                                    component="div"
                                    sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
                                    row>
                                    <FormLabel id="demo-checkbox-buttons-group-label">Select Your Hobbies</FormLabel>
                                    <Box>
                                        <FormControlLabel control={<Checkbox
                                            id="0"
                                            checked={checkbox[0]}
                                            onChange={(e) => {
                                                handleCheckbox(e)
                                            }}
                                        />}
                                            label="Readings Blogs"
                                        />
                                        <FormControlLabel control={<Checkbox
                                            id="1"
                                            checked={checkbox[1]}
                                            onChange={(e) => handleCheckbox(e)
                                            }
                                        />} label="Watchings Tech Videos" />
                                        <FormControlLabel control={<Checkbox
                                            id="2"
                                            checked={checkbox[2]}
                                            onChange={(e) => handleCheckbox(e)
                                            }
                                        />} label="Playing Computer Games" />
                                        <FormControlLabel control={<Checkbox
                                            id="3"
                                            checked={checkbox[3]}
                                            onChange={(e) => handleCheckbox(e)
                                            }
                                        />} label="Playing Ground Games" />
                                        <FormControlLabel control={<Checkbox
                                            id="4"
                                            checked={checkbox[4]}
                                            onChange={(e) => handleCheckbox(e)
                                            }
                                        />} label="Listning Music" />
                                    </Box>
                                </FormGroup>
                            </Box>
                        </Stack>
                        <Box>
                            <Typography id="non-linear-slider" gutterBottom>
                                Rate your communication skills  (1-5)
                            </Typography>
                            <Slider
                                value={sliderValue}
                                min={1}
                                step={1}
                                max={5}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                                sx={{ width: 80 }}
                            />
                        </Box>

                        <Stack sx={{ justifyContent: "center" }} spacing={2} direction="row">
                            <Button
                                type="submit"
                                color="success"
                                variant="contained">Update</Button>
                            <Button type="cancel" color="error" variant="outlined">Cancel</Button>
                        </Stack>

                    </Box>
                </Card>
            </Container>
        </React.Fragment >
    )
}

export default Update;
