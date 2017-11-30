export class BaiVietStatus {
    //Người viết bài
    static DRAFT_01: string = "DRAFT";
    static NEW_02: string = "NEW";
    static EDIT_03: string = "EDIT";
    static APPROVEREJECTED_05: string = "ApproveRejected";

    //Người duyệt bài
    static EDITATAPPROVE: string = "EDITATAPPROVE";
    static APPROVEREQUEST_04: string = "APPROVEREQUEST";
    static PUBLISHREJECTED_0141: string = "PublishReject";

    static MULTIAPPROVED_06: string = "MULTIAPPROVED";

    //Người đăng bài
    static APPROVED_011: string = "APPROVED";

    static PUBLISHREQUEST_012: string = "PUBLISHREQUEST";
    
    static DIEUCHINHGUIDANG_013: string = "DIEUCHINHGUIDANG";

    static PUBLISHED_014: string = "PUBLISHED";
    static EDITATPUBLISHED_017: string = "EDITATPUBLISHED";
    static PUBLISHLATER: string = "PUBLISHLATER";

    static UNPUBLISH_016: string = "UNPUBLISH";

    static KHOITAO: string = "KHOITAO";

    constructor() {

        // this.APPROVEREQUEST = "APPROVEREQUEST";
        // this.APPROVED = "APPROVED";
        // this.PUBLISHED = "PUBLISHED";
        // this.UNPUBLISH = "UNPUBLISH";
        // this.APPROVEREJECTED = "ApproveRejected";
        // this.PUBLISHREJECTED = "PublishReject";
    }

    static GetStatusName(status: string): string {
        var statusName = "";
        if (status == this.NEW_02) {
            statusName = "Vừa Tạo"
        } else if (status == this.DRAFT_01) {
            statusName = "Bản Nháp"
        } else if (status == this.EDIT_03) {
            statusName = "Điều Chỉnh"
        } else if (status == this.APPROVEREJECTED_05) {
            statusName = "Từ Chối Duyệt"
        } else if (status == this.APPROVEREQUEST_04) {
            statusName = "Chờ Duyệt"
        } else if (status == this.EDITATAPPROVE) {
            statusName = "Sửa Lúc Duyệt"
        } else if (status == this.APPROVED_011) {
            statusName = "Đã Duyệt"
        } else if (status == this.MULTIAPPROVED_06) {
            statusName = "Đã Duyệt"
        } else if (status == this.PUBLISHED_014) {
            statusName = "Đã Đăng"
        } else if (status == this.UNPUBLISH_016) {
            statusName = "Bị Gỡ Đăng"
        }
        else if (status == this.EDITATPUBLISHED_017) {
            statusName = "Điều Chỉnh Duyệt Đăng"
        } else if (status == this.PUBLISHREJECTED_0141) {
            statusName = "Bị Từ Chối Đăng"
        }else {
            statusName = status;
        }
        //return status;
        return statusName;
    }
}

export class ListAction {

    static checkActionEnable(actionNum: number, trangThai: string): boolean {
        if (trangThai === undefined) trangThai = BaiVietStatus.KHOITAO;
        let flag = false;
        this.GetList().forEach(element => {
            if (element.actionNum == actionNum) {
                flag = element.listEnableStatus.includes(trangThai);
                return
            }
        });
        if (flag)
            console.log('action ', actionNum, 'trangThai ', trangThai, ' TRUE')

        console.log('action ', actionNum, 'trangThai ', trangThai, 'flag', flag)
        return flag;
    }

    static GetAfterStatus(actionNum: number): string {
        let objectStatus = '';
        this.GetList().forEach(element => {
            if (element.actionNum == actionNum) {
                objectStatus = element.afterStatus;
                return
            }
        });
        console.log('action ', actionNum, 'status ', objectStatus)
        return objectStatus;
    }

    static GetHistoryMessage(actionNum: number): string {
        let message = '';
        this.GetList().forEach(element => {
            if (element.actionNum == actionNum) {
                message = element.historyMessage;
                return
            }
        });
        // console.log('action ', actionNum, 'status ', message)
        return message;
    }


    static GetList(): Action[] {
        let List: Action[] = new Array<Action>();
        //Yêu Cầu 
        List.push(new Action(
            0, [
                BaiVietStatus.KHOITAO,
                BaiVietStatus.DRAFT_01
            ],
            BaiVietStatus.DRAFT_01,
            'tạo nháp'
        ))
        List.push(new Action(
            1, [
                BaiVietStatus.KHOITAO
            ],
            BaiVietStatus.NEW_02,
            'đã tạo mới'
        ))
        List.push(new Action(
            2, [
                BaiVietStatus.KHOITAO,
                BaiVietStatus.DRAFT_01
            ],
            BaiVietStatus.APPROVEREQUEST_04,
            'đã tạo và gửi điều chỉnh'

        ))

        List.push(new Action(
            3, [
                BaiVietStatus.DRAFT_01,
                BaiVietStatus.NEW_02,
                BaiVietStatus.EDIT_03
            ],
            BaiVietStatus.EDIT_03,
            'đã lưu'
        ))

        List.push(new Action(
            4, [
                BaiVietStatus.DRAFT_01,
                BaiVietStatus.NEW_02,
                BaiVietStatus.EDIT_03
            ],
            BaiVietStatus.APPROVEREQUEST_04,
            'đã Gửi Duyệt'
        ))

        List.push(new Action(
            5, [
                BaiVietStatus.APPROVEREJECTED_05
            ],
            BaiVietStatus.EDIT_03,
            'đã Điều Chỉnh'
        ))

        List.push(new Action(
            61, [
                BaiVietStatus.APPROVEREQUEST_04
            ],
            BaiVietStatus.APPROVEREJECTED_05,
            'đã Từ Chối Duyệt'
        ))

        List.push(new Action(
            6, [
                BaiVietStatus.APPROVEREQUEST_04
            ],
            BaiVietStatus.MULTIAPPROVED_06,
            'đã Duyệt'
        ))

        List.push(new Action(
            7, [
                BaiVietStatus.MULTIAPPROVED_06,
            ],
            BaiVietStatus.MULTIAPPROVED_06,
            'đã Chấm Điểm'
        ))

        List.push(new Action(
            11, [
                BaiVietStatus.KHOITAO,
                BaiVietStatus.MULTIAPPROVED_06
            ],
            BaiVietStatus.APPROVED_011,
            'đã Duyệt cho Báo '
        ))

        List.push(new Action(
            112, [
                BaiVietStatus.KHOITAO,
                BaiVietStatus.MULTIAPPROVED_06,
            ],
            BaiVietStatus.PUBLISHREQUEST_012,
            'đã Duyệt và Gửi Đăng'
        ))

        List.push(new Action(
            12, [
                BaiVietStatus.APPROVED_011,
                BaiVietStatus.DIEUCHINHGUIDANG_013,
            ],
            BaiVietStatus.PUBLISHREQUEST_012,
            'đã Gửi Đăng cho Báo '
        ))

        List.push(new Action(
            13, [
                BaiVietStatus.PUBLISHREJECTED_0141
            ],
            BaiVietStatus.DIEUCHINHGUIDANG_013,
            'đã Điều Chỉnh'
        ))

        List.push(new Action(
            141, [
                BaiVietStatus.PUBLISHREQUEST_012
            ],
            BaiVietStatus.PUBLISHREJECTED_0141,
            'đã Từ Chối Đăng '
        ))

        List.push(new Action(
            14, [
                BaiVietStatus.PUBLISHREQUEST_012,
                BaiVietStatus.UNPUBLISH_016,
                BaiVietStatus.EDITATPUBLISHED_017
            ],
            BaiVietStatus.PUBLISHED_014,
            'đã Đăng cho Báo '
        ))

        List.push(new Action(
            15, [
                BaiVietStatus.PUBLISHED_014
            ],
            BaiVietStatus.EDITATPUBLISHED_017,
            'đã Điều Chỉnh '
        ))

        List.push(new Action(
            16, [
                BaiVietStatus.PUBLISHED_014
            ],
            BaiVietStatus.UNPUBLISH_016,
            'đã Gỡ Đăng '
        ))

        List.push(new Action(
            17, [
                BaiVietStatus.UNPUBLISH_016
            ],
            BaiVietStatus.EDITATPUBLISHED_017,
            'đã Điều Chỉnh '
        ))

        List.push(new Action(
            18, [
                BaiVietStatus.UNPUBLISH_016
            ],
            BaiVietStatus.PUBLISHREJECTED_0141,
            'đã Trả Về '
        ))

        return List;
    }
}
export class Action {
    actionNum: number;
    listEnableStatus: string[];
    afterStatus: string;
    historyMessage: string;
    constructor(num: number, statuses: string[], afterStatus: string = '', message: string = '') {
        this.actionNum = num;
        this.listEnableStatus = statuses;
        this.afterStatus = afterStatus;
        this.historyMessage = message;
    }
}
