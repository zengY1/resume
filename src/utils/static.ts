const records = ['博士后', '博士', '硕士', '本科', '大专', '高中', '中专', '初中', '小学', '肄业']
const salaryArr = ['面议', '1K', '2K', '3K', '4K', '5K', '6K', '7K', '8K', '9K', '10K', '11K', '12K', '13K', '14K', '15K', '16K', '17K', '18K', '19K', '20K', '21K', '22K', '23K', '24K', '25K', '26K', '27K', '28K', '29K', '30K', '35K', '40K', '45K', '50K','60K', '70K', '80K', '90K', '100k']
const imgArr = ['gitHub', 'CSDN', '博客园', '简书', '掘金', '码云', '其它']
function getImgUrl(data) {
    let url = ''
    const type = parseInt(data)
    if (type === 0) {
        url = '/img/art/github.jpg'
    } else if (type === 1) {
        url = '/img/art/csdn.jpg'
    } else if (type === 2) {
        url = '/img/art/boyuan.jpg'
    } else if (type === 3) {
        url = '/img/art/jian.jpg'
    } else if (type === 4) {
        url = '/img/art/juejing.jpg'
    } else if (type === 5) {
        url = '/img/art/mayun.jpg'
    } else if (type === 6) {
        url = '/img/art/other.jpg'
    }
    return url
}
 // 处理年龄
 function dateUtil(date) {
    const nowDate = new Date().getTime();
    const da = new Date(date).getTime();
    const hou = Math.floor((nowDate - da) / (3600 * 24 * 1000));
    return Math.ceil(hou / 365);
  }
export { records, salaryArr, imgArr,getImgUrl,dateUtil }