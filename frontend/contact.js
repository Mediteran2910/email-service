const contactForm = document.querySelector("form");
const nameInput = document.getElementById("senderName");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const formButton = document.getElementById("form-button");

const respondMessage = async (response, responseData) => {
  const messageElement = document.createElement("p");
  if (response.ok && responseData.success) {
    messageElement.textContent =
      responseData.message || "Message sent succesfully";
  } else if (responseData) {
    messageElement.textContent =
      responseData.message || "Failed to send message.";
  } else {
    messageElement.textContent = "An unexpected error occurred.";
  }
  contactForm.appendChild(messageElement);

  setTimeout(() => {
    contactForm.removeChild(messageElement);
  }, 3500);
};

contactForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  let infoObj = {
    name: nameInput.value,
    email: emailInput.value,
    message: message.value,
  };

  try {
    const response = await fetch("http://localhost:3000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ infoObj }),
    });
    const responseData = await response.json();
    respondMessage(response, responseData);
  } catch (error) {
    console.log("Error:", error);
    respondMessage({
      success: false,
      message: "An error occurred while sending the message",
    });
  }
});
