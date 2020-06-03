function batchFilterType(value) {
    if (value == "static") {
        document.getElementById("batchFilterTypeStatic").style.display = "inline";
        document.getElementById("batchFilterTypeRangeContainer").style.display = "none";
    }
    else {
        document.getElementById("batchFilterTypeStatic").style.display = "none";
        document.getElementById("batchFilterTypeRangeContainer").style.display = "block";
    }
}