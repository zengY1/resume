var reg=/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
function regMobile (mobile){
    console.log('m',mobile)
    if(!mobile){
        return null
    }
    const a=reg.exec(mobile)
    return a
}
export default regMobile