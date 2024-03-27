import React from 'react';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {CardActionArea} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    minHeight:'250px',
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));


function RequisitionSelectPage(props) {

    return (

        <Box sx={{ flexGrow: 1,backgroundColor:'#F7F9FC',padding:'50px 5px 50px 5px' }}>
            <Grid container spacing={10}>
                <Grid item xs={12}>
                    <Grid container  direction="row" justifyContent="center" alignItems="center" spacing={10}>
                        <Grid item xs={3}>
                            <Item>
                                <Card sx={{height:'250px'}}>
                                    <CardActionArea onClick={()=>props.pageSwitch('supply')} n>
                                        <img
                                            src={`https://ein.az.gov/sites/default/files/plan-icon.png`}
                                            srcSet={`https://ein.az.gov/sites/default/files/plan-icon.png`}
                                            alt={"alt"}
                                            loading="lazy"
                                            height="180"
                                            width="150"
                                        />

                                        <CardContent>
                                            <Typography sx={{ fontSize: 18, color:'#1570EF',fontWeight:'bold' }}>
                                                Requisition By Stock Plan
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>

                                </Card>
                            </Item>

                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <Card sx={{height:'250px'}}>
                                    <img
                                        src={`data:image/png;base64,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`}
                                        srcSet={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAADCCAMAAACYEEwlAAABQVBMVEX///8/qfUAAAD8/PwLCws+qfZTU1NDqPASEg/o5+ZWrOlCqvQgU3QFJjhBqe9Or/IjIyPg4OAyNjhqampUVFoJBwU7q/xUl8YQHCtJntsJFxl6enoTExP///v29vYSEhIbGxvLy8tLS0s9PT1ZWVnFxcUwMDDV1dXl5eVvb28/p/58fHy9vb38+PspKSlHR0f///WsrKwaEgAfRWUADBYyXXyVlZUjIRnl4ek8OkUXGxMABQBSSUgWAAAcFhMLGhoUIiZrg5IQOlxkmcEWNkwLHzlcU0sABhEXERgTEiBGRD8XMk7k7+woLyre39MAFwsPM0dZptxDNCkpMzs7eKUVIyMAJkMaQl0AAA4oQlNXo+MAFSMNFCx5dGsWOmNip884Z40fERmmt78AABtMsukeU34BGS4pDwUhAABsmbXK09tAzbXeAAAL4UlEQVR4nO2dC1fbRhqGxzMSsiUi26SWsdHNGGzjcCkgkhY2JmWhkJCbk2xJobtN0zTdzf//Aft9I+E4WE4I1sUnmve0zjlwaklPvss7F00JERISEhISEhISEhISEhISEhISEhISEhISEhISEhIijLFyw4bPtG8kVdltSpsdkmkIjNyuuG6pnPZ9pClIg0XTlcxWO+07SVOMzDilDSplmwJAaJWbkgMZkeG6AJFQtmeos97OMAWEQOwlmum6gBAYKWxIUiu7PYJHAviFlkmz2ykDCATrgtsgdtr3k4oCCJARS9ApG2nfTjq6hMCIvShJGc2IQSQQZjcrktsmGWyVlzWBIIUlSYK6kL0x5RAEgnUBXFO2ITBmL0KPyF5dGE4HRpCC6WbOO36SDiBw0FJpOWPF8SoEpOCUMuaaRiAQzAgzW2PKEQiMjyndTHnHqxAwAOzbkBHLJDu2aTQdCNYFycySawqFwDPCzI5rCoXAbMgIyVlO4X5SUTgEhnXBdKeXAuNDvmi+ipEZE6fXRq/BM0Ka1h7Bhj4n/i5GmmapE/7LgMIUuiYeBO0NGpkcaXFc/bMXqCtNpYOGOy6vS6YUlajZCI8rBmPKlel0TVgQ7lKzuTQTke60x9gBHFMyyAia4piSkbH1b4HSQlJ3cZu6TooZERRANvrThUpiEHhdcFbTq4788UMhJBgJDCiYZmp+AQ1LuXA1EhOGgOVxibrJuibLsgh/Uut7Pu157+q4PnEIvC6YiXZKCylgWQYIP/xId/dWRm8qUQj8mn5dSIxCEAmWxUjnH/d7+/szV2+IpACBu6ZGwi2CWTZ5vHG/V3rgfXf1VyR5CDbDjHCSdk2MFJ5Qb/6n+YtpiATMT/COdDWx6zF+0XLzvndQ/ed772eeH8P3kwIEwuuCKW0mOtfUWaRbhzW9dmROC4TLWEgGAtaDQvPYu1XV5drRydRAIDCachOiwBm0PG++VtT16tHDqagJ/MIMOyXdjO8KA4+E3bHdrMyfVjVNK1aPLqahO/Dromu6E2t1vPRI+PH0ET05rWk53ZCr8/XvyLSkA+F1ATMippTgkcD4H4+f7Jm/1IrFaYSAsRBjXeDZAGbZevrk2f5hTdNVbQohMD8jYqwLWA5I+9Hes7OaktP1aYSAFMAv0Ji8Y2BCyo8q+cNqTlZyxjSmA864kRXHuR3PtxOeEYV1yT3qK0bXMAx5KiHgJEfTbMUz0cSwJpbX695pPyfLQGEquwOfXVigUjyRwOtBuenVD8Ej5ZDBdNYEm8/CRzz/PHhAgFBuHs/fqsrQF4yurOtjIgGVYiTYd7hrjLJH+vaAcaNUWK+cnJ4bci4H+QAf4yDA9VcoHbNyFp8YX4YgC9H7BN8to1Ek7Sd556BWVHIDjU+HTif5HUU+g9vAYDlixxiMGCwcLzzbBX+gF68Bgfnr0smK94UFfyUmhouvWcwqPNndP+xDHdC/BMEfySS/kQYZQD2QVnGyLdoOiY+yBh5pfSv/vK8pisxrwmchpBAIwYrgCs+FyC+OX722RtqtinnWV2QwCKMQrNHucPOr3fA/tHG/7wr3yzHgh87ASHvO84CBgk5R/mI63PRKE90l4bngrsYRhHwaofMvr37aL0I5MMAjxQVhErFgVgkY2DGEAo4bS179ZT+nqjowKH6EEDjGHyO/5g2E6w5upeEPoCJS4JGIxbAeOMfb57KsaeiRtAEDKJGy3j99kH/RmptQrdZc68WLuZe3y1+fFf5j89XIiOuBP42Ea22s/aRyclD7+OwfBUh09dXRhZOfVI7j1be2vIv7GyNr3NeAEPiDUtT+wLeJjNeDvf3Tc2UoCwZSwDwq6qvt01uT6hcQfB659O7XPwjjs0mlyH2irzXchba1u3/W12QlBIKuYEpoRTUCFTW1r1Y9GAJ/9YP4+xNw3GhHbNACj9Ro5cErQw2UjdBIMLhtAPMwmWTFMODr+q+lq+v8w/cz7le4s9WMtib6X8zIGnqkdekE4sBAjzQKAQvlsIGcQIBT0/UqrQxPhlxuBmJ+3ofepr+Lz43nbSB+0fIDzzvtw7N2u92wZwUG8GPw0hNKMyCkoP1Ux88Ihf8tD40bYxiqcC/eqHsX231d0wBCLqw9AJ4BjEl0mRW11wMIq3OLG4sbqJnmSntcpGOALPJ5JPTNkUOwbKgHnvdrTVeLmAu6EgohxwvCpBBkA6IBYNc+RsImDbazOpJE3eXwdAh2upcaY/PlBhpab2RWu3Ty8KCfk3Ud814Ji4ShnJhMGnZbXa99rAmbtDQQ7m0eiQR/3IhjplK040br0iOhT+xVHh6oWiRl74sMdJmPSoYgkI5tF2yuQtNZH52r43/1NtaDMRufbw7B/3r4s1HKn2yfa8WwLIgBQm4EwuDBGJmRQt53CBjwehDP4Nlq3Nurb4M/SA/C0K5p/0yV0dssBPUgao+EWgOf2MvvH57nZCWpdAiJhI80eCSMhgJ/+ycOj0R8j+Tu5s/6ULNzYR4pYQgh70X6HmkGxo2xzGlz4I0HdWe2r3M3nFph/AwE3gyQgRtLPeCh1Sh5HvdIRtfQx3bGaCF8VSTgbWI9aMXzbijff1D36s/Pi7pigE8M9UjpQyCDMVMMFGzIhd08eGVD0bVu11ASYfA1EPwlDTxxye+Nscwnrt7L17fPkykFN4LAz9LA8xPiWuezvn968vC37b5a/PKNpwghxnrAIfyb/vaf80/WG5OBcO3ugL1xKRg3xhMKbO2F+/x3PaHGOAzhKyLB3qCmU46nHnCtLW3t7/S1pClcD4L/2HjOUivWdX+2SnsP36j65IPjWCAwFpw1FeeSN3tM7tI//nzzbjoLI+PnZzjx+MSB8P22TepeQEYkGgrXTge7KUlmObaaGECwGFCoX+yoGmZEUllxXQiFJanin9Ma++4HiAX6RpWNHIBIZOhwnRbJ6wGMmRI7sRcoHL9RjZyi6kmNIq8TCZALpnSDFdsbU9iVdlRDPleTSYgvQljH03qD86sTesUJ60IvjxTGzzEnCwEevgNjprl2ohvCgAJFCokwuAaETmHx8gTvBHeEbb7erQCF6agJ0np5TpKcTsLbAi3ylm7lZ9VkQuHLkTDnOK3E6sEAAiPgoOs7yay+BBCUMbPNS45rOs12PPNIn6VgYaf03qh8n1J4k/B/GEXthFZsgC8ZB0FyzVJyvfFToWvaQdekyIY2+qzBEqWsTS6929WUbrd2PxRCg9KQdbiktEpND6sjbmgeXYDArTq4T0PTJt2pohUNowj/ViujEDAFOm07pTjAy6J3RArnagiEnD+8AAqKPqm6XV3pAoSQTRosWCZPCwJ3Tdgp5fDtCbhZBxEoucmyQdG7BkLo/3kcAoErvdMnGWbEVmVWDV+Ng1IBfQ23nk2qd/DPu+K73y9GITCSsEMK0yoF13Qe6poQgtKvvvprNhL9NfvrCb2T8uOGClyThxkR1iQRglo9ff++PumOVvOPE9M5Odn9O7bVhIkErukt7UmhFBQo7P3ti3p0hw7eW06vAn5OuCpF896s6psj+QqE6i3zxdNCBHrc+aHTwYXAKWTAtzmvUteZxS6p4HzTUHvgW/2XpuB9hyS0aea9nZqMrkmL7c2XKRcLMsIwdFUxsgqBkWWaz59ddU3ZgkC4a8qjXxiuCZmCwLUq9fauuKbMQQC/8LoHDnp4E2/mIIBr+kC3pDM1qzWBywbXZPquKbsQuGuqOMfomvBYGXnccSLfvJalvLPdx5eWcL4tmxAYaVSk+hl3Tfq403W+eYF3dPP5WXRNei6jEHCcuyr5c01QF7IJgWuZ9vYwI7AwGlmFQD5c8HHEuGPHsiDLIm/dLXNbzWp34LL5mPIYKGQYAj9XYk/yDvu8JuSvntGaHTVKprTdl3PV+d7Pad9LWoKMKJngoJXqUT27kcBIO/+3t61Wj0aOMc+McK6p/V/z/cH/5kcOtM+WGqWLi5dufint+0hXy+uVrV4v25GAJ64AhBscg/INiTHrqUmT+38qTKUsy2Kdtx/wABohISEhISEhISEhISEhISEhISEhISEhISEhISEhIfJ/9yF+9dikvsMAAAAASUVORK5CYII=`}
                                        alt={"alt"}
                                        loading="lazy"
                                        height="180"
                                        width="150"
                                    />
                                    <CardContent>

                                        <Typography sx={{ fontSize: 18, color:'#1570EF',fontWeight:'bold' }}>
                                            Stock Transfer Order
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Item>

                            
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <Card sx={{height:'250px'}}>
                                    <img
                                        src={`https://t3.ftcdn.net/jpg/04/46/87/42/360_F_446874259_ZyDWsZXV9PioXzm0CrgqIxgwGMsQLZQI.jpg`}
                                        srcSet={`https://t3.ftcdn.net/jpg/04/46/87/42/360_F_446874259_ZyDWsZXV9PioXzm0CrgqIxgwGMsQLZQI.jpg`}
                                        alt={"alt"}
                                        loading="lazy"
                                        height="180"
                                        width="150"
                                    />

                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color:'#1570EF',fontWeight:'bold' }}>
                                            Adhoc/Emergency Order
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Item>
                        </Grid>
                </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container  direction="row" justifyContent="right" alignItems="right" spacing={2}>

                        <Button
                            variant="contained"
                            startIcon={<ArrowBackIosIcon />}
                            onClick={() => {
                                props.pageSwitch('orderlist');
                            }}
                            sx={{fontWeight:'bolder',  "&:hover": { background: "rgb(153, 46, 98)", color: "white"}
                            }}
                        >
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default RequisitionSelectPage;
