import sweetAlert from "sweetalert2";

export default (msg, type) => {
    sweetAlert.fire({
        icon: type || "success",
        title: "An error has occured.",
        text: msg
    });
}