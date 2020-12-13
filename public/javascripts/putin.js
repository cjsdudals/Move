function add_textbox(){
    document.getElementById("t_space").innerHTML +=`<select name="grade" id="option">
    <option value="">학년선택</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
</select>
<a id="text">학년</a>
<select name="cla" id="option">
    <option value="">반선택</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
</select>
<a id="text">반</a>
<a id="text">번호</a>
<select name="num" id="option">
    <option value="">번호선택</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
    <option value="10">10</option>
    <option value="11">11</option>
    <option value="12">12</option>
    <option value="13">13</option>
    <option value="14">14</option>
    <option value="15">15</option>
    <option value="16">16</option>
    <option value="17">17</option>
    <option value="18">18</option>
    <option value="19">19</option>
    <option value="20">20</option>
</select>
<a id="text">이름</a>
<input type="text" class="input" required autofocus><br>`
}