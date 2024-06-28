import { Stack, Typography } from '@mui/material'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

export const NotFoundRoute = () => {
  return (
    <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ height: "85vh", flexDirection: "column"}}
    > 
        <Typography 
        fontWeight={'bold'}
        textTransform={'uppercase'} fontSize={35} variant="h4">
            Error
        </Typography>
        <Typography fontWeight={'bold'} textTransform={'uppercase'} letterSpacing={'1rem'}  fontSize={'clamp(7rem, 8vw, 15rem)'} variant="h2">
              404
        </Typography>
        <Typography  >
        <FormattedMessage
            id="error.title"
            defaultMessage="This page does not exist"
          />
        </Typography>
        <Typography  >
        <FormattedMessage
            id="error.text"
            defaultMessage="The page you are looking for does not exist."
          />
        </Typography>

        <Typography >
        <FormattedMessage
            id="error.text2"
            defaultMessage="Please check the URL or go to the home page"
          />
        </Typography>
        
        <Stack mt={4}>
            <Link to={`/`} className=" d-none d-sm-block">
              {" "}
              <button
                className="__boton-mediano enphasis-button"
                id="colecciones"
              >
                     <FormattedMessage
                    id="boton.home"
                      defaultMessage="Home"
                      />
              </button>
            </Link>
            
          </Stack>
    </Stack>
  )
}
