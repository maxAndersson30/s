"use client"

import { useObservable } from "dexie-react-hooks"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Head from "next/head"
import { useRouter, useSearchParams } from "next/navigation"
import { DXCUserInteraction, resolveText } from "dexie-cloud-addon"
import { uniqBy } from "lodash"
import {
  Alert,
  alpha,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { db } from "./db/db"
import { ArrowBack, ArrowCircleRight, Check } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

const StyledDiv = styled("div")(({ theme }) => ({
  backgroundColor: `${theme.palette.primary.light} !important`,
  "& h3": {
    marginTop: "0px",
  },
  "& form": {
    marginBottom: "20px",
  },
  "& input[type=otp], & input[type=email]": {
    borderRadius: "5px",
    fontSize: "1rem !important",
    padding: "15px 15px",
    cursor: "pointer",
  },
  "& button": {
    borderRadius: "5px",
    fontSize: "1rem",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
  },
  "& button[type=submit]": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    marginRight: "10px",
  },
  "& > div > div": {
    border: "none !important",
    boxShadow: `${alpha(
      theme.palette.primary.main,
      1
    )} 0px 0px 80px 10px !important`,
  },
}))

interface Field {
  type: string
  label: string
  placeholder: string
}

interface MyFields {
  [key: string]: Field
}

export default function SignIn({ fields, onSubmit }: DXCUserInteraction) {
  const [params, setParams] = useState<{ [param: string]: string }>({})
  const theme = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams() // Use searchParams instead of router.query
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [myFields, setMyFields] = useState<MyFields | undefined>(undefined)
  const [success, setSuccess] = useState(false)
  const ui = useObservable(db.cloud.userInteraction)
  const currenUser = useObservable(db.cloud.currentUser)
  const [isFocused, setIsFocused] = useState(false)

  const mySubmit = useCallback(
    (ev: any) => {
      if (myFields?.["otp"] !== undefined && !params["otp"]?.length) {
        const alert: DXCUserInteraction["alerts"][number] = {
          type: "error",
          messageCode: "INVALID_OTP",
          message: "Invalid OTP given",
          messageParams: {},
        }

        setAdditionalAlerts((a) =>
          a ? uniqBy([...a, alert], "messageCode") : [alert]
        )

        return
      }

      ev?.preventDefault()
      if (onSubmit == undefined) return
      onSubmit(params)
    },
    [myFields, onSubmit, params]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      if (params["fromCode"]?.length && params["fromCode"] == "true") {
        mySubmit(undefined)
        const { fromCode, ...restOfParams } = params
        setParams({
          ...restOfParams,
        })
      }
    }, 800)
    return () => {
      clearInterval(timer)
    }
  }, [mySubmit, params])

  useEffect(() => {
    const otp = searchParams.get("otp")
    const email = searchParams.get("email")
    const id = searchParams.get("id")

    if (otp != undefined && otp != params["otp"]) {
      setParams({
        ...params,
        ["email"]: email ? email.toString() : "",
        ["otp"]: otp ? otp.toString().toUpperCase() : "",
        ["otpId"]: id ? id.toString().toUpperCase() : "",
        ["fromCode"]: "true",
      })
    }
  }, [searchParams, mySubmit, params])

  useEffect(() => {
    if (fields != undefined && fields != myFields) {
      setMyFields(fields)
    }
  }, [fields, myFields])

  const reset = () => {
    router.refresh() // For refreshing the page
  }

  const [additionalAlerts, setAdditionalAlerts] = useState<
    DXCUserInteraction["alerts"] | undefined
  >()

  useEffect(() => {
    if (
      currenUser?.userId != undefined &&
      currenUser?.userId != "unauthorized"
    ) {
      setSuccess(true)
    }
  }, [currenUser?.userId, router])

  const alerts = useMemo(() => {
    return additionalAlerts ?? ui?.alerts
  }, [additionalAlerts, ui?.alerts])

  if (myFields == undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          color="primary"
          size={48}
          sx={{ marginRight: "0px" }}
        />
      </Box>
    )
  }

  return (
    <StyledDiv>
      <Head>
        <title>Sign in</title>
      </Head>
      <Box
        style={{
          display: "flex",
          backgroundColor: alpha(theme.palette.text.primary, 0.05),
          width: "100%",
          height: "100vh",
          padding: "0px",
          margin: "0px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: isSmallScreen ? "0px" : "30px",
            padding: isSmallScreen ? "0" : "0px 50px 10px 50px",
            boxShadow: isSmallScreen ? "0" : "0 11px 34px 0 rgba(0,0,0,.2)",
            minWidth: isSmallScreen ? "100vw" : "700px",
            minHeight: isSmallScreen ? "100vh" : "700px",
            justifyContent: "center",
            backgroundColor: theme.palette.background.default, // "#FBFBFD"
          }}
        >
          <Box
            style={{
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            <img
              src="/company-icon.png"
              alt="Dexie Starter"
              style={{
                maxWidth: "30%",
              }}
            />
          </Box>
          <Box
            style={{
              justifyContent: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            {myFields &&
              Object.entries(myFields).map(
                ([fieldName, { type, label, placeholder }], idx) => (
                  <Box key={idx}>
                    <h1 style={{}}>
                      {type != undefined && type == "otp"
                        ? "Code from email"
                        : "Sign in with email"}
                    </h1>
                    <form
                      onSubmit={(ev) => {
                        mySubmit(ev)
                      }}
                    >
                      <TextField
                        ref={idx === 0 ? firstFieldRef : undefined}
                        autoFocus={isSmallScreen ? false : true}
                        key={type + " " + label + " " + placeholder}
                        type={type}
                        name={fieldName}
                        disabled={onSubmit == undefined || success}
                        autoComplete="on"
                        placeholder={placeholder}
                        value={params[fieldName] || ""}
                        onFocus={() => {
                          setIsFocused(true)
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            setIsFocused(false)
                          }, 300)
                        }}
                        onInput={(ev) => {
                          setParams({
                            ...params,
                            [fieldName]: valueTransformer(
                              type,
                              (ev.target as any)?.["value"]
                            ),
                          })
                          setAdditionalAlerts(undefined)
                        }}
                        id="outlined-basic"
                        variant="outlined"
                        sx={{
                          width: "100%",
                          maxWidth: "350px",
                          "& fieldset": {
                            borderRadius: "10px",
                          },
                          "& input": {
                            fontSize: "20px",
                            marginLeft: "10px",
                          },
                        }}
                        InputProps={{
                          autoComplete:
                            type != undefined && type == "otp"
                              ? "one-time-code"
                              : "email",
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              onClick={(ev) => mySubmit(ev)}
                              style={{ cursor: "pointer" }}
                            >
                              {onSubmit == undefined ? (
                                <>
                                  {success ? (
                                    <Check
                                      style={{
                                        width: "32px",
                                        color: theme.palette.primary.main,
                                        marginRight: "2px",
                                      }}
                                    />
                                  ) : (
                                    <CircularProgress
                                      color={"primary"}
                                      size={24}
                                      sx={{ marginRight: "3px" }}
                                    />
                                  )}
                                </>
                              ) : (
                                <ArrowCircleRight
                                  style={{
                                    height: "32px",
                                    width: "32px",
                                    color: theme.palette.text.disabled,
                                  }}
                                />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </form>
                    {alerts
                      ?.filter((o) => o.type == "error")
                      .map((alert, i) => (
                        <Alert
                          severity="error"
                          sx={{
                            maxWidth: "300px",
                            margin: "auto",
                            mt: 2,
                            borderRadius: "10px",
                          }}
                          key={i}
                        >
                          {resolveText(alert)}
                        </Alert>
                      ))}
                    <Box
                      style={{
                        color: theme.palette.text.secondary,
                        marginTop: "25px",
                        textAlign: "center",
                        fontStyle: "italic",
                        fontSize: "12px",
                      }}
                    >
                      {type != undefined && type == "otp"
                        ? "We just sent you a temporary login code!"
                        : "Sign up is done automatically on sign in."}{" "}
                      <br />
                      {type != undefined && type == "otp"
                        ? "Check your email."
                        : "By signing up you agree to our"}{" "}
                      {type != undefined && type != "otp" && (
                        <>
                          <a
                            href="/terms"
                            target="_blank"
                            style={{
                              color: theme.palette.text.secondary,
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                          >
                            Terms of Service
                          </a>
                        </>
                      )}
                      {type != undefined && type == "otp" ? (
                        <Box
                          sx={{
                            marginTop: "48px",
                            cursor: "pointer",
                            opacity: !isFocused ? 1 : 0.4,
                            transition: "opacity 0.3s",
                          }}
                          onClick={() => {
                            if (!isFocused) {
                              console.log("reset")
                              reset()
                            } else {
                              console.log("not focused")
                            }
                          }}
                        >
                          <ArrowBack
                            style={{
                              height: "48px",
                              width: "48px",
                              color: alpha(theme.palette.text.primary, 0.25),
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            marginTop: "48px",
                            height: "48px",
                            width: "48px",
                          }}
                        ></Box>
                      )}
                    </Box>
                  </Box>
                )
              )}
          </Box>
        </Box>
      </Box>
    </StyledDiv>
  )
}

function valueTransformer(type: string, value: string) {
  switch (type) {
    case "email":
      return value.toLowerCase()
    case "otp":
      return value.toUpperCase()
    default:
      return value
  }
}
