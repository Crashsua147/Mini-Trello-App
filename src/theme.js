import { extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors';

const theme = extendTheme({
  trello: {
    appBarHeight: '65px',
    boardBarHeight: '65px',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
      }
    },
    dark: {
        palette: {
        primary: cyan,
        secondary: orange,
      }
    }
  },
  colorSchemeSelector: 'class',
})

// const theme = createTheme({
//   colorSchemes: { light: true, dark: true },
//   cssVariables: {
//     colorSchemeSelector: 'class'
//   }
// });

export default theme;