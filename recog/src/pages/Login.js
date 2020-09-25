import React, { Component, Fragment, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { loginWithGoogle } from '../helpers/auth';
import firebase from 'firebase'; 
import {firebaseAuth} from '../config/constants' // Stores keys and sensitive information.

import {
  Grid,
  Typography,
  Card,
  Button,
  Hidden,
  Box,
  withStyles,
  withWidth,
  isWidthUp,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import CodeIcon from "@material-ui/icons/Code";
import CloudIcon from "@material-ui/icons/Cloud";
import MessageIcon from "@material-ui/icons/Message";

const userId = 'userId';  // key in local storage.
const iconSize = 30;

const styles = (theme) => ({
  extraLargeButtonLabel: {
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  extraLargeButton: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  card: {
    boxShadow: theme.shadows[4],
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    position:"relative",
    left:"0%",
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(5.5),
      paddingBottom: theme.spacing(5.5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    [theme.breakpoints.down("lg")]: {
      width: "auto",
    },
  },
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    paddingBottom: theme.spacing(2),
  },
  image: {
    maxWidth: "100%",
    verticalAlign: "middle",
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
  },
  container: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(12),
    marginLeft: "25%",
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(9),
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(3),
    },
  },
  containerFix: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "none !important",
      justifyContent: "center",
    },
  },
});

const features = [
  {
    color: "#0091EA",
    headline: "Scan your notes",
    text:
      "Upload scanned images of your handwritten notes, and they will automatically be converted into text",
    icon: <MessageIcon style={{ fontSize: iconSize }} />,
  },
  {
    color: "#304FFE",
    headline: "Stored in cloud. Access from anywhere.",
    text:
      "All your notes are stored in cloud. You can edit and access them from anywhere.",
    icon: <CloudIcon style={{ fontSize: iconSize }} />,
  },
  {
    color: "#C51162",
    headline: "Write anything from code to equations.",
    text:
      "Uses a Markdown editor which allows you to quickly format and edit a range of content, including code. Supports syntax highlighting for multiple languages",
    icon: <CodeIcon style={{ fontSize: iconSize }} />,
  },
];

function calculateSpacing(width) {
  if (isWidthUp("lg", width)) {
    return 5;
  }
  if (isWidthUp("md", width)) {
    return 4;
  }
  if (isWidthUp("sm", width)) {
    return 3;
  }
  return 2;
}

// Really nice shading function I found.
function shadeColor(hex, percent) {
  const f = parseInt(hex.slice(1), 16);

  const t = percent < 0 ? 0 : 255;

  const p = percent < 0 ? percent * -1 : percent;

  const R = f >> 16;

  const G = (f >> 8) & 0x00ff;

  const B = f & 0x0000ff;
  return `#${(
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
    .toString(16)
    .slice(1)}`;
}

// Feature cards
function FeatureCard(props) {
  const { classes, Icon, color, headline, text } = props;
  return (
    <Fragment>
      <div
        className={classes.iconWrapper}
        style={{
          color: color,
          backgroundColor: shadeColor(color, 0.5),
          fill: color
        }}
      >
        {Icon}
      </div>
      <Typography variant="h5" paragraph>
        {headline}
      </Typography>
      <Typography variant="body" color="textSecondary">
        {text}
      </Typography>
    </Fragment>
  );
}
FeatureCard.propTypes = {
  classes: PropTypes.object.isRequired,
  Icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};
const FeatureCardProp = withStyles(styles, { withTheme: true })(FeatureCard);

// Wraps all features and Feature Cards up
function FeatureSection(props) {
  const { width } = props;
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom">
          Features
        </Typography>
        <div className="container-fluid">
          <Grid style={{margin: 0,width: '100%', paddingBottom:'3%'}} container spacing={calculateSpacing(width)}>
            {features.map(element => (
              <Grid
                item
                xs={6}
                md={4}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.headline}
              >
                <FeatureCardProp
                  Icon={element.icon}
                  color={element.color}
                  headline={element.headline}
                  text={element.text}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}
FeatureSection.propTypes = {
  width: PropTypes.string.isRequired
};
const FeatureSectionProp = withWidth()(FeatureSection);


// Main Login Component. 
function LoginComponent(props) {
  const { classes, theme, width } = props;
  return (
    <Fragment>
      <div className={classNames("lg-p-top", classes.wrapper)}>
        <div className={classes.container}>
          <Box display="flex" flexDirection="column" paddingTop="25vh" paddingBottom="25vh" justifyContent="center" className="row" width="70%">
            <Card
              className={classes.card}
            >
              <div className={classNames(classes.containerFix, "container")}>
                <Box justifyContent="space-between" className="row">
                  <Grid item xs={12} md={5}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="100%"
                    >
                      <Box mb={4}>
                        <Typography
                          variant={isWidthUp("lg", width) ? "h3" : "h4"}
                        >
                          Recog
                        </Typography>
                      </Box>
                      <div>
                        <Box mb={2}>
                          <Typography
                            variant={isWidthUp("lg", width) ? "h6" : "body1"}
                            color="textSecondary"
                          >
                            A cloud-based markdown editor capable of translating handwritten notes into text.
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          className={classes.extraLargeButton}
                          classes={{ label: classes.extraLargeButtonLabel }}
                          onClick={props.handleGoogleSignIn}
                        >
                          Login with Google. 
                        </Button>
                      </div>
                    </Box>
                  </Grid>
                  <Hidden smDown>
                    <Grid item md={6}>
                    </Grid>
                  </Hidden>
                </Box>
              </div>
            </Card>
          </Box>
        </div>
      </div>
      <FeatureSectionProp/>
    </Fragment>
  );
}
/*
LoginComponent.propTypes = {
  classes: PropTypes.object,
  width: PropTypes.string,
  theme: PropTypes.object,
};
*/
const LoginProp = withWidth()(withStyles(styles, { withTheme: true })(LoginComponent))
export default class Login extends Component {
    constructor(props) {
        super(props); 
        this.handleGoogleSignIn = this.handleGoogleSignIn.bind(this);
    }

    handleGoogleSignIn() {
        loginWithGoogle();
    }

    componentDidMount() {
        if (localStorage.getItem(userId)) {
            this.props.history.push('/app/home'); 
            return; 
        }
        firebaseAuth().onAuthStateChanged(user=> {
            if (user) {
                localStorage.setItem(userId, user.uid); 
                this.props.history.push('/app/home'); 
            }
        })
    }

    render() {
        return(
            <LoginProp handleGoogleSignIn={this.handleGoogleSignIn}/>
        )
    }

}