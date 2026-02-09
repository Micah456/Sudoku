from flask import Flask, render_template

app = Flask("sudoku")

@app.route("/")
def index():
    return render_template("sudoku.html")


if __name__=="__main__":
    app.run(debug=True, port=5000) 
    # When no port is specified, starts at default port 5000