"use client";
import { db } from "@/firebase";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleReturnHome = () => {
    router.push("/");
  };

  const handleViewCollections = () => {
    router.push("/flashcards");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await response.json();
      console.log(data);
      setFlashcards(data.flashcards || []);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard Collection with the same name already exists.");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: "#000000",
    color: "#ffffff",
    position: "fixed",
    width: "100%",
    zIndex: 1201,
    [theme.breakpoints.down("sm")]: {
      padding: "0 10px",
    },
  }));

  const StyledLink = styled(Button)({
    color: "#ffffff",
    textDecoration: "none",
  });

  const Footer = styled(Box)({
    backgroundColor: "#000000",
    color: "#ffffff",
    padding: "20px 0",
    textAlign: "center",
    marginTop: "auto",
  });

  return (
    <Box
      sx={{
        backgroundColor: "#051014",
        color: "#ffffff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CardCrush
          </Typography>
          <StyledLink onClick={handleViewCollections} passHref>
            Collections
          </StyledLink>
          <StyledLink onClick={handleReturnHome} passHref sx={{mr: 2}}>
            Home
          </StyledLink>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </StyledAppBar>
      <Container
        maxWidth="lg"
        sx={{
          color: "#ffffff",
        }}
      >
        {}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1200,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#051014",
            color: "#ffffff",
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mt: 10,
              mb: 1,
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Generate Flashcards
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 3, color: "#b0b0b0", textAlign: "center", maxWidth: 600 }}
          >
            Easily create flashcards by entering text. Click "Submit" to
            generate flashcards based on your input. You can review and save
            your flashcards once generated.
          </Typography>
          <Paper
            sx={{
              p: 4,
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              backgroundColor: "#ffffff",
            }}
          >
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{
                mb: 2,
                backgroundColor: "#f0f0f0",
                borderRadius: 1,
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 20,
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
                "&:hover": {
                  boxShadow: "0 6px 8px rgba(0,0,0,0.3)",
                },
              }}
            >
              Submit
            </Button>
          </Paper>
        </Box>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{ mb: 4, fontWeight: "bold", color: "#ffffff" }}
            >
              Flashcards Preview
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {flashcards.map((flashcard, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  display="flex"
                  justifyContent="center"
                >
                  <Card
                    sx={{
                      width: "100%",
                      maxWidth: 500,
                      borderRadius: 4,
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                      overflow: "hidden",
                      backgroundColor: "#ffffff",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleCardClick(index)}>
                      <CardContent>
                        <Box
                          sx={{
                            perspective: "1200px",
                            position: "relative",
                            width: "100%",
                            height: "200px",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              transformStyle: "preserve-3d",
                              transition: "transform 0.6s",
                              transform: flipped[index]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                            }}
                          >
                            {}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 3,
                                boxSizing: "border-box",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                borderRadius: 2,
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                border: "1px solid #ddd",
                                fontSize: "1rem",
                                color: "#333",
                              }}
                            >
                              <Typography variant="h6" component="div">
                                {flashcard.Front || "Front Text"}
                              </Typography>
                            </Box>

                            {}
                            <Box
                              sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backfaceVisibility: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 3,
                                boxSizing: "border-box",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                borderRadius: 2,
                                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                border: "1px solid #ddd",
                                fontSize: "1rem",
                                color: "#333",
                                transform: "rotateY(180deg)",
                              }}
                            >
                              <Typography variant="h6" component="div">
                                {flashcard.Back || "Back Text"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", pb: 4 }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpen}
                sx={{ borderRadius: 20 }}
              >
                Save Collection
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your flashcard collection.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Collection Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ backgroundColor: "#f0f0f0", borderRadius: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={saveFlashcards}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
      
      <Footer sx={{pb:5, pt: 5, pr: 2, pl: 2}}r>
        <Typography variant="body2">
          © CardCrush 2024. All rights reserved.
        </Typography>
        <Typography variant="caption">
          Disclaimer: While we strive for accuracy, flashcards generated by AI may contain errors. Please review the content for accuracy before use.
        </Typography>
      </Footer>
    </Box>
  );
}