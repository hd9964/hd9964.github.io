/**
 * Created by �ƶ� on 2016/8/24.
 */


/**
 * Created by �ƶ� on 2016/8/25.
 */
/**
 * Created by yoyo on 2016-08-22.
 */
/**
 *
 * @param tag ��Ҫ�ı��Ŀ��
 * @param obj ��Ҫ�ı������
 * @param fn ִ�е���һ���¼�
 */
function animate(tag, obj, fn) {
    clearInterval(tag.timer);
    tag.timer = setInterval(function () {
        var flag = true;
        //ͬʱ���ö�����Ե�ֵ�����ȱ�������
        for (var key in obj) {
            if (key == "opacity") {
                //͸���Ȳ��ܽ���parseInt
                var leader = getStyle(tag, key) * 100;
                //step = ( target - leader ) / 10
                var target = obj[key] * 100;
                var step = (target - leader) / 10;
                //����һ��step��ֵ����step��������ȡ��
                step = leader > target ? Math.floor(step) : Math.ceil(step);
                //leader = leader +  step
                leader = leader + step;
                //���ø�attrֵ
                tag.style[key] = leader / 100;
                //������Ϊĳһ�����Ե�����ָ��λ�þ������ʱ������Ϊ�������Կ��ܻ�û���ط�
                //�ж��Ƿ�ǰ���Ե�����ָ��λ��
            } else if (key == "zIndex") {
                //�㼶
                //�㼶����Ҫ���䣬����ֱ������
                tag.style[key] = obj[key];
            } else {
                //��ȡĳ����ʽ�ĵ�ǰֵ
                //target����obj[key]  attr ���� key
                var leader = parseInt(getStyle(tag, key)) || 0;
                //step = ( target - leader ) / 10
                var target = obj[key];
                var step = (target - leader) / 10;
                //����һ��step��ֵ����step��������ȡ��
                step = leader > target ? Math.floor(step) : Math.ceil(step);
                //leader = leader +  step
                leader = leader + step;

                //���ø�attrֵ
                tag.style[key] = leader + "px";
                //������Ϊĳһ�����Ե�����ָ��λ�þ������ʱ������Ϊ�������Կ��ܻ�û���ط�
                //�ж��Ƿ�ǰ���Ե�����ָ��λ��
            }
            if (leader != target) {
                //��ֹ��ʱ�������
                flag = false;
            }
        }
        if (flag) {
            //�������ʱ��������˾ɵģ��ٴο����µ�
            clearInterval(tag.timer);
            //ִ�е����if�ڲ�˵�����е��˶�ִ�������
            //�ж���û��fn������в�ִ��
            //�ڵ�ǰ�˶�������ִ���µ�һ����
            if (typeof fn == "function") {
                fn();
            }
            //fn && fn();
        }
    },50);
}

function getStyle(tag, attr) {
    return tag.currentStyle ? tag.currentStyle[attr] : getComputedStyle(tag, null)[attr];
}