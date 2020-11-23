import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfigService, ICollectionTreeOptions } from '@sunbird/shared';
@Component({
  selector: 'app-editor-base',
  templateUrl: './editor-base.component.html',
  styleUrls: ['./editor-base.component.scss']
})
export class EditorBaseComponent implements OnInit {

  public collectionTreeNodes: any;
  public collectionTreeOptions: ICollectionTreeOptions;
  public selectedQuestionData: any = {};
  public refresh: Boolean = true;

  constructor(private configService: ConfigService, private cdr: ChangeDetectorRef) {
    this.collectionTreeOptions = this.configService.appConfig.collectionTreeOptions;
   }

  ngOnInit() {
    this.collectionTreeNodes = {
      'data': {
        'ownershipType': [
          'createdBy'
        ],
        'copyright': 'NCERT',
        'keywords': [
          'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय',
          'ऑनलाइन शिक्षण के दौरान सुरक्षा , बचाव और गोपनीयता',
          'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
        ],
        'channel': '0123221758376673287017',
        'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
        'organisation': [
          'EKSTEP'
        ],
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'variants': {
          'online': {
            'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar',
            'size': 32699
          },
          'spine': {
            'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'size': 1104989
          }
        },
        'leafNodes': [
          'do_31313398097120460811398',
          'do_31313459126286745611582',
          'do_31313402698105651211544',
          'do_3131339728289546241845',
          'do_3131340293650841601930',
          'do_31313474605245235212030',
          'do_313133975595655168155',
          'do_31313472227985817611976',
          'do_3131339798579281921909',
          'do_31313483394648473611208',
          'do_31313483573434777611860',
          'do_31313458495336448011707',
          'do_31313477350508134412125',
          'do_3131339659511971841906',
          'do_31313471869309747211677',
          'do_3131347275282268161289',
          'do_31313478176004505611054',
          'do_31313396328849408011957',
          'do_31313402816037683211431',
          'do_3131340323801907201134',
          'do_3131339686433587201844',
          'do_3131339850007183361849',
          'do_31313475711469158411171',
          'do_3131292436049264641492',
          'do_31313474043200307211689',
          'do_3131345828580229121941',
          'do_31313476933029068811835',
          'do_31313478172178022411334',
          'do_31313478248306278411335',
          'do_31313403369611264011448',
          'do_3131340162837626881924',
          'do_31313397741881753611521'
        ],
        'objectType': 'Content',
        'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313406305859174411460/artifact/nishtha_icon.thumb.jpg',
        'primaryCategory': 'Course',
        'children': [
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': 'do_3131430588156067841367',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.827+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                "type": "reference",
                "category": "VSA",
                'editorState': {
                  'question': '<p>Question</p><ol><li>Hello Hello</li><li>Bye BYe</li><li>Okay OKay</li></ol><figure class="image"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXQAAABfCAYAAAD4fzwSAAAABmJLR0QA/wD/AP+gvaeTAAASU0lEQVR4nO2deZQV9ZXHP90N0tCoEEQEFya4BTVxw4VxiXbUKHE/hohrPIREcQkJiZjEkXabSSJuE5MoJNHEqEfijMZMoo5khDFqVBJGRcyMRkBFRLYQgqjQ1Pxxq1K/qq5Xr97Wb/t+znmn6726VXX7Vb1bt+7v3vsDIYQQQgghRO3QUm0FhGgS9gf2AQ6stiKibpkGfJAmIIMuROVpBV4CBgEjqqyLqF+2AdanCfTpJUWEaGZOB/YCrgAuqrIuon7ZUm0FhBAwH1gNbF1tRYQQQhTPiYAHTK+2IkIIIUrjd8A6YHC1FRGNj2LoQlSOY4DDgG8Dayt4nHbgNCyDph14G5gDPFfBYwohRFPxBLAB2L6CxzgUeANYBTwNLMFCPB4wF9ilgscWQoimYCxmVG+u4DH2Av4K3IZ55gGnA+/5x38L2LmCOogaQnnozcGngU7gI/5rO/81CNgT+Fv1VGtYHsG+890xDzqJM4ExWHzdPS9bgL0zHOPXwE7AJ4G/xNZ9DbjBX/4lcGoBujc6ewPbYk80QtQdCwkfw93Xn6upFDAaM0rt+QTrjP0xo3x7ikwrViSSdF7mZDhGf2CTL78CGBZbP8DZfzewQ3b1G5pPYedGOd2ibjkVK2iZQWgEPOCuKuoENpDnAaOqrEe5eRDYDOyWR+4c4GJgJlGD3pXhGMNi2xyfIDM/z/pmYxtgKfZ9yKCLumcgUYM+sbrqcIavRyP1NxmNecR3FbDN3kSNc2eGbVqAx33510lOiwzWe8DJBejTqMwi/D5k0EXd82mihmOP6qrD53w9jqiyHuXkHsygZ4mBB1xIeE42YTfeLLQBHwP65Vj/urPffE8LjU4QapFBFw3DdYQX9LtUf1D8bBrLoI/CDPL9BW53D+F5+X2ZdNnP2ee8Mu2zXnFDLTLoomGYR3hB/6LKugCcT2MZ9FmYoTigwO1cYzOjTLrc7+/vfcy4NzMzsfMyFxl00SD0AzYSXtCXVlcdAC6gcQz6Tliv6ocL3O4fiHqOJ5VBlxP8fW0GzirD/uqZINTyA2ywWQZdNASHEzUc+1ZXHcAGZRvFoN+K/S//WOB25xKek24sH70UdsbCaRuxLKJmJgi1LMU6XXbR4AZdvVyaB9dorsImXBDlYTvs5vQ4hRerHO4s/w+wpgQ9BmJFRO3AOKz1QDMzA2t9cAJ5JoZoFGTQmwfXoD+OeShHYe1dd8E6As4DZgMf9rZydc5UoAO4voht3fPyGFZwNA7LSBqG3Xz/EwvlpHmVfbFxkR2Bo4E/FKFLI3EM8AXgTuDRMu53CNZaYU/saepF4GeUdiMGu35OxCqHh2OD60uwIrOnSty3aDDaMIMdPG5eA/yXv7waeBWLt3rAy1hctzeohZBLCzAFOLjI7Qdj3+2TRWw7lGgq3VeABf7yO1jaYbD+ScyYJNEK/BwzAEmpqC9iN4hmoQOrgn6baH5+F8WHXLYGfogNMgfnZ4m/vBw4BKureAG7sW5VwH6/i7XfCMJuy4CVjq73YjdsIQC768dTtlYBn8eMPcCuwGJ//atkz4UuhWob9MHAQ5SW2vdPFF+JGRRWuedlKVYEFKSUHoi13vWw3uptPXfDrcAizDuPM9zfdnQR+tUr38P+53j/mi6KM+j7EOb0rwbGE56fIzDju4bQ2Htka4g2FjPeHuYUfJNoZ859sbYOHvD1AvQVDc5Uoobj/0j2wi9xZK4u4jgDMCOZ9XWpf6xxBW6Xq5CmEA4AXiP6vYwtcB8d2I/5jxSX039b7PjPkDwoeqMjc0Fs3TTsJnAIlgc/CjMEB2K92K/Dnr7K8Z3VA2MxL/fuhHVdFG7QR2PeuId1tkwqGAtmpQpeb2XYr9sRcylWIOYyFHjF2Wez1xIIh18RXhgrgJE55DoduWUUZqQGYhe81wuvhQXolcRkzJvaENvvvxe4n+BGWWwnw5ecY/8J636ZxERHzh10PYtoyCbX67Ui9as3+mFPKu9iBjFOF4UZ9MFEawTSUkCXO3L5CsuOxsapPCzUsk+CzJVEz+FDGfTVoGgT0EY0pHE9dpEm0eosj8C8vawdGTcA15I7zpvEJ7AMhHvI5tUEvFKAbJyrgauwgeHzsTBG0BzsFGyw638z7KcdM+gvYZklhTKUqLf3dXq2wA1wb6xjMMM1APgx2W66i4rQrx65FvOoz8CenEplJuEEIQuB+3LItRKNmadlOo0CHiCMiV9PsoPixsw3A7fkUxZk0JuB/bDezwFpqWzxGOyOZDfoHmH/7axMxAz6HRQ3qFgMczGv6Cbs0fxmLOYK9sOcCnwxw34uwOLTX8X+90I5ktAYdwP/nSLrnpe+WPbLeix2noVm6Pu9PzaoPBv4tzLs7zjsxhAQ1BkkMZpoqCwtK+UmR3Yt8K855G7Fntj6Aj8Fns2jLyCD3lu0Yd33KtmT+ockhwyOcpbXYFksuYgXG31Qok61yBNEb2o/AaZjueQA52Ee/Dsp++gLXI6FMoptoXCUs/wCNiiWi6Tzsha4oshjF8N4YFIF978Mu8F3F7HtVpjRWwdcViZ9upzlbtIrgN1agg1YPUEuuVOc9/f58kmsAb6crmJPZNB7h62wR+X4JATlJFc3vU86y0+SHjuMp+6tKEmj+uA9rCz8Kv99P6x3/PSUbc7GBpUvoDgDBFGDnu/p5CBnuRvLUOptdqOybY6HY7+TjUVs+y3g48AEynPN7kF0gPwZLC6fi8Oc5d9jIZIkzo29/1XhqolmZzXhwEpa6lM74ai7h3mAlb7hVzttMWB7ov/7SixGnUQbFmNfTPG5wYOIDmZ+NkV2JNHBMVX4RtkDe2L5M/Y9pr1mEx0Udde5js8Uot/5tDw6LHZkr0mRcwdON2M56EJkZijRC/OwFNljY7KzK65d7Rh0sJCV+/9fnEMuaPl7YQnHOih2rJ1SZCfFZL9bwnEbkeMpT+aUO+3fj2LrXGMfZ5eY7HE55LaJyS0o6L/MiEIujY07tdsm0svB45WEPy+/OjXNDZjxDAp3pmKDte7jcysWt15OadP3ueflLdIzfNzz4mEZQSLkdeA7GWUnEGatENvOTe10Q6MeuWPiYN0cA7aQe/AyHm59PmWfQiTidlhckiLXQvSxcT69M/lFLXnoYOlkrhc1Prb+s/7nU0o8zjnOMeamyG1NWBLuUZ7sjWYmaHeRLw/9YUfu1Tz7/Kkj+4Lz+XZY64GgECzuyVdkQLs1v4ioY1Y7y8tT5I4mrBzdjI2uF5OKV+/E0y7dMYcWbPBtJZafXArueUnLphmPVaOCpSnmi+WKdLI6KW4O+5spcq1E539100MnYAO9b/vvl2M35wD3GsjH8aSHfUST0AczBB72aJpEK/aYGHgO3+wd1YDa89AhOquNR/iDPYXyeVZBfxUP8xqTGEC0SnFCGY7b7DxJNg/9IkfumRS5rxG9Vs5x1s3DMm7cgXP3CfDbGXU+E6sqVUaMAML5KjeTnAd/C+FFdge9+9RWiwb9M0R/pI/4nz+HVXLmKs8vlKf8/a/CMoxc2rCagmrcZBuZ+UQNekcOuWGEs3utJLkh2hewFFL3WglK+Ef6626MbTOGsKvpItI7MvYn7MOzgORWBqIJ2R0zRB52lw9SpYYBDxJe3DMoPW5+DPlTx9xXkFlyVYHbjSlRzzRaCFvYugbVI1psUiqHE/bzmEn44x5F6EluwqofRXFMxpyUWfR88vKwgdAH/PXx7/lyR24Goac9FOt/7mHxc9frPxl7Kp6NhVeGJ+g0zZF/lJ5O1q6+TNDd8X4sQ0aIvzMWiwV6WDXdQix318Pyd8vRK3sgPT2WSr1y9aIpF+fFjrcFazxW6vRwcU4mbI27GjsvgQe3gGhBkSicoDVyltec2LYtmGENfidrsfOzyV+e7MvthWUpeZhXvxz7HZxDbiYRnvfNWF3DK4QD4BuxbpFpacaJ9EYmg6gNOrBKtcMwb3ApdhHPoXzzK+5HWEJfSZZQ2Q6CfbHshpHOZ9+hMpkJQ7C+9EHP+sXAf5AeuxXZ2Be7HoOmZ56zvDVh2va2/ud/TNjHSOBzWCO1jVjq7wOYQQ4YhDV6288/xl2k9+YBcw5OAw7FvP4PsfDbU8BvYvsXQpTIVwi9t40kPz4LIYSoAzowj8kjY+tSIYQQtcs1WNpnWmm+EEKIOkGT8wohhBBCCCGEEEIIIYQQQtQ5ST0KXAZgM4Jsj432J02tNBSbKf1Dips+SgghRAXZEetX4E7LtQ7rENbPlxmGldYG5d5bsB4GlZw3UwghRAGMwfpKbMQKKiZgfaHXELb73AFrHrMKayF5FmHDmqd77lIIIUSlifdyGY7NurESOANrGBPweeBOfzmYRPdgrA3k8diUZUP89TsBy0rQa1fK16Y0jTdJn81bCCHqkhbgMcxYfzRh/SFEu5NN9z9v87dJ6gtcDEOwjma90bVvYQl6CiFETeFOEn02NmP1F7GOb3FGxN7/zP87iGiHvSVYO8hiWYO1lywlFr+ObB0E/1TCMYQQomaZi8XOB+RY30Xo2canM7sDy3J5GfVwFkKIquB66Ldjc+C9l0P2SGc5Pg/il/xXMzMR+FS1lRBCNA2XEptsOusEF/2whuv9/fdnA/eWT6+GYCYWKhJCiN5gJPCG+0GfHIJxDiU05mDhGRFlMfB8tZUQQjQNHxS74dWE8fOXy6aOEEKIspHVQ+90luPx80pwBD1nw64Ei9ANSgjRoPTBJhB26SCc+drDKkeT6IvNw3hAiToMoXdy0D2UtiiEaCBcD/0bwJWYYb4Q+In/+bFEjfyLOfZ1JnATMJ7k2bOzshrLFhmST7AMyKALIRqOTqKe6xxn3X3O5++THKZpAZ7D0h77J6wXQghRYQLj3Bn7/CX/bwdwovP56yS30P0GVlA0GbXQFUKIqjKF0At/GBjof347VkL/pr9uPdGmWa3AV7EWug+RPa9dCCFEhRiGFQ6tB64DzgcexIz4tcBo4C/++z9g/V4uwVrlesAvUahFCCFqhk6sqVbgqa/AQigBewKPEE5oEXQrnIg8cyGEqDpJhngI5m0vw4x2nA6sb/paYn0EhGhi+mAtpvfEwpKrgdeAZ0kedxJCCFFjtGHjSCtIrnVYB8zA5t4VQghRo3Rgk8J4wDvAbcAVwM3YbF+uYX+baMdSIYQQNUILlgzgAbPomRTQilVObyE06huwRndCCCFqiDMxI50vXbeLqKe+FGWECSFETfE7zEA/g6Xx5jLq/QgTDILXlN5QUAghRH7aiabvesDFKfI3xGSfqrSCojlprbYCQtQhQ+j52zkuRf7Z2PsDUO2GqAAy6EIUzrvAX2OfvZVH3qUd2LasGgkhhCias7BGdB6wABiRInsC0ZDLJrJPLgMwANgXGAd8ohhlhRBCpNOfdEMe4Da/C1pmZGF34MfA32LbP4tVpLYDlwFTscFXIYQQFeY3RA3ytzJsMxnLWw+eAE7CvPTLsHDPO4RFTR5wXtm1FkIIEeGjWC+XwPCuIv9sXF2O/L309L6PJVqw5AFjy6axEEKIRO4kanjzedJueGY+FlZJ4glH7j16zgUshBCijBxJNF/91jzyBwEfOvJHpMje5cjNK1VRIYQQuRmMTdkYGN2bSc89bwMWOfL5io/c5l//XKqyQgghkmkDfk1ocK/MsM25REMzl6TIbkc0hj6uFGWFEELkJij17wYuyrjNfEIDvQUYmSJ7qiPbDXykaE2FEELkZBJmaD/AOjJmYQRRj3tBHvkZjmzWnHYhhBAFcDqWorie3L1d+mPxdbftxulEwy235DnO847szBL0FUIIkUAn8D6WZ35witzdWJjE7Yl+KVGDfm7K9tsSzWtXQZEQQpSRMVj15pvA6DyyrwJvxD6bRtSg75Oy/Ukx2d2ddV8GJmbWWgghRITdsG6Kr2FVoWnsgBnh38Y+/xJRI903ZR83OnIrCFMhh2I57LMK0F00GIV0fBNCRBkGPIr9jqZgxnWUv24rbBLpgCFYdgqY8XdZ5Cx3YwOkSQwGJjjvn8YMO8Bp2I3g4ezqCyGEADPW7uBkIa/4FHTtwEpn/c4JxxuIVYS6+7ncWf845rGnefeiwdEEF0IUx91Y7LwYXom9fx/4F+d9PA6+NzAXG2x1UxoD77wTOAb4HtZrXQghREZ2pjjPPM0DbwF+4Mg8BkwH7sEM/mKs18vHsAFYD5t8+gZgOZaPPqDc/6ioLzSvoRCFMxS4rshtu7EJpb0c68dhPc8PweLwi4D7ge9jMyQB7AVcizX/Goh1XpyEGXjRxPw/I0Ckkrg0MioAAAAASUVORK5CYII=" data-mathtext="x%3D%5Cfrac%7B-b%5Cpm%5Csqrt%7Bb%5E2-4ac%7D%7D%7B2a%7D" advanced="false"></figure>',
                  'answer': '<figure class="image"><img src="https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_1131148075934351361141/artifact/500_internal_server_error.png" alt="do_1131148075934351361141" data-asset-variable="do_1131148075934351361141"></figure>',
                  'solutions': [
                    {
                      'id': '33900c76-075c-691f-97f8-69d6211d575b',
                      'type': 'html',
                      'value': '<p>SolutionSolutionSolutionSolutionSolutionSolutionSolutionSolutionSolutionSolutionSolution</p><p>Solution</p><p><br data-cke-filler="true"></p><p>SolutionSolution</p><figure class="image"><img src="https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_1131148075934351361141/artifact/500_internal_server_error.png" alt="do_1131148075934351361141" data-asset-variable="do_1131148075934351361141"></figure>'
                    }
                  ]
                },
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313396328849408011957/5_1_objective.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313396328849408011957/uddeshy_1603273750034_do_31313396328849408011957_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313396328849408011957/uddeshy_1603273750125_do_31313396328849408011957_1.0_spine.ecar',
                    'size': 34919
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 109933,
                'gradeLevel': [
                  'Others'
                ],
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313396328849408011957/artifact/nishtha_icon.thumb.jpg',
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313396328849408011957/5_1_objective.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 105295
                },
                'lockKey': '9b615ac9-0448-48e5-9316-c280a54bf26b',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313396328849408011957',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 4361746
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:49:10.029+0000',
                'size': 456902,
                'name': 'Reference Question - VSA',
                'status': 'Live',
                'code': 'c1280662-c243-4774-8a64-8414b50550ea',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313396328849408011957/5_1_objective.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T07:56:42.991+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:49:08.403+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:55:10.517+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-21T09:49:10.182+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273748403',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313396328849408011957/uddeshy_1603273750034_do_31313396328849408011957_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:01:45.454+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588156067841367',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:49:14.254+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'responseDeclaration': {
                  'responseValue': {
                    'cardinality': 'single',
                    'type': 'integer',
                    'correct_response': {'value': '0'}
                  }
                },
                'type': 'mcq',
                'templateId': 'mcq-vertical',
                'editorState': {
                  'question': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">If f(x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) = f (x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) ⇒ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> = x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∀ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∈ A then the function f: A → B is</span></p>',
                  'options': [
                    {
                      'answer': true,
                      'value': {
                        'type': 'text',
                        'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one</span>&nbsp;</p>',
                        'resvalue': 0,
                        'resindex': 0
                      }
                    },
                    {
                      'answer': false,
                      'value': {
                        'type': 'text',
                        'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one onto</span></p>',
                        'resvalue': 1,
                        'resindex': 1
                      }
                    },
                    {
                      'answer': false,
                      'value': {
                        'type': 'text',
                        'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">onto</span></p>',
                        'resvalue': 2,
                        'resindex': 2
                      }
                    },
                    {
                      'answer': false,
                      'value': {
                        'type': 'text',
                        'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">many one</span></p>',
                        'resvalue': 3,
                        'resindex': 3
                      }
                    }
                  ],
                  'solutions': [
                    {
                      'id': '5b1f0dda-cd2d-cc09-4fce-a0065bfa1229',
                      'type': 'html',
                      'value': '<p>Answer: (a) one-one</p>'
                    }
                  ]
                },
                'body': '<div class=\'mcq-vertical cheveron-helper\'><div class=\'mcq-title\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">If f(x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) = f (x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">) ⇒ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> = x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∀ x</span><sub>1</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> x</span><sub>2</sub><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);"> ∈ A then the function f: A → B is</span></p></div><i class=\'chevron down icon\'></i><div class=\'mcq-options\'><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=0 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one</span>&nbsp;</p></div><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=1 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one onto</span></p></div><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=2 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">onto</span></p></div><div data-simple-choice-interaction data-response-variable=\'responseValue\' value=3 class=\'mcq-option\'><p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">many one</span></p></div></div></div>',      
                'options': [
                  {
                    'answer': true,
                    'value': {
                      'type': 'text',
                      'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one</span>&nbsp;</p>',
                      'resvalue': 0,
                      'resindex': 0
                    }
                  },
                  {
                    'answer': false,
                    'value': {
                      'type': 'text',
                      'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">one-one onto</span></p>',
                      'resvalue': 1,
                      'resindex': 1
                    }
                  },
                  {
                    'answer': false,
                    'value': {
                      'type': 'text',
                      'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">onto</span></p>',
                      'resvalue': 2,
                      'resindex': 2
                    }
                  },
                  {
                    'answer': false,
                    'value': {
                      'type': 'text',
                      'body': '<p><span style="color:rgb(34,34,34);background-color:rgb(255,255,255);">many one</span></p>',
                      'resvalue': 3,
                      'resindex': 3
                    }
                  }
                ],
                'solutions': [
                  {
                    'id': '5b1f0dda-cd2d-cc09-4fce-a0065bfa1229',
                    'type': 'html',
                    'value': '<p>Answer: (a) one-one</p>'
                  }
                ],
                'category': 'MCQ',
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339659511971841906/5_2_content-outline.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339659511971841906/saamgrii-kii-ruuprekhaa_1603273716688_do_3131339659511971841906_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339659511971841906/saamgrii-kii-ruuprekhaa_1603273716775_do_3131339659511971841906_1.0_spine.ecar',
                    'size': 34924
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 88434,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131339659511971841906/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339659511971841906/5_2_content-outline.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 91651
                },
                'lockKey': '8e1a605c-777f-4020-b42d-e0104aeb38f3',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131339659511971841906',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 3344880
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:48:36.685+0000',
                'size': 321641,
                'name': 'MCQ Question',
                'status': 'Live',
                'code': '56d39a86-e83d-4c5c-b514-a81a493bbb9c',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339659511971841906/5_2_content-outline.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:02:08.028+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:48:36.508+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:25:14.632+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-21T09:48:36.862+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273716508',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131339659511971841906/saamgrii-kii-ruuprekhaa_1603273716688_do_3131339659511971841906_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:05:13.473+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588156067841367',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:17:29.712+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588156067841367',
            'lastStatusChangedOn': '2020-11-03T04:21:36.827+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 1,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296827',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'QuestionSet 1',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 2,
            'leafNodes': [
              'do_3131339659511971841906',
              'do_31313396328849408011957'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '626974da-70c6-4ae5-8d5e-06f69c262171',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.826+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313474043200307211689/ict-hindi-indu-mam.mp4',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313474043200307211689/shikssaa-men-aaii.sii.ttii.-pricy_1603365716243_do_31313474043200307211689_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313474043200307211689/shikssaa-men-aaii.sii.ttii.-pricy_1603365725296_do_31313474043200307211689_1.0_spine.ecar',
                    'size': 34909
                  }
                },
                'mimeType': 'video/mp4',
                'me_totalRatingsCount': 111526,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313474043200307211689/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313474043200307211689/ict-hindi-indu-mam.mp4',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 109513
                },
                'lockKey': '9c96d11a-ab1e-423b-9380-f20a76f88ddf',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'identifier': 'do_31313474043200307211689',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 14451654
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:21:56.206+0000',
                'size': 105363589,
                'name': 'शिक्षा में आई.सी.टी.: परिचय',
                'status': 'Live',
                'code': 'ba0e8757-21ee-4405-ae5b-b06a8d5630ac',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpprodmedia-inct.streaming.media.azure.net/c7fcfc8f-0a7a-401f-a1d1-2da81db47b4f/ict-hindi-indu-mam.ism/manifest(format=m3u8-aapl-v3)',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T10:17:49.142+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:21:56.081+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:13:39.595+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:22:05.374+0000',
                'creator': 'NCERT COURSE CREATOR 1',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603365716081',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313474043200307211689/shikssaa-men-aaii.sii.ttii.-pricy_1603365716243_do_31313474043200307211689_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T10:26:59.728+0000',
                'createdBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'compatibilityLevel': 1,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155985921365',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:05:34.219+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313471869309747211677/5_4-shikssaa-men-aaii.sii.ttii.-pricy-viiddiyo-prtilipi.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313471869309747211677/shikssaa-men-aaii.sii.ttii.-pricy-viiddiyo-prtilipi_1603361683052_do_31313471869309747211677_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313471869309747211677/shikssaa-men-aaii.sii.ttii.-pricy-viiddiyo-prtilipi_1603361683100_do_31313471869309747211677_1.0_spine.ecar',
                    'size': 34973
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 81777,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313471869309747211677/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313471869309747211677/5_4-shikssaa-men-aaii.sii.ttii.-pricy-viiddiyo-prtilipi.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 80197
                },
                'lockKey': '87d8265f-504b-4e7b-b438-d25e6271531f',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313471869309747211677',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 5149027
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T10:14:43.047+0000',
                'size': 76653,
                'name': 'शिक्षा में आई.सी.टी.: परिचय- वीडियो प्रतिलिपि',
                'status': 'Live',
                'code': '64d03623-abd8-4e70-9d83-e9d904b237ec',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313471869309747211677/5_4-shikssaa-men-aaii.sii.ttii.-pricy-viiddiyo-prtilipi.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T09:33:35.467+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T10:14:42.873+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:38:28.981+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T10:14:43.162+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603361682873',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313471869309747211677/shikssaa-men-aaii.sii.ttii.-pricy-viiddiyo-prtilipi_1603361683052_do_31313471869309747211677_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T09:39:23.072+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588155985921365',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:31:08.253+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155985921365',
            'lastStatusChangedOn': '2020-11-03T04:21:36.826+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 2,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296826',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'शिक्षा में आई.सी.टी. का परिचय',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 2,
            'leafNodes': [
              'do_31313474043200307211689',
              'do_31313471869309747211677'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '9308489e-a9bc-4c97-9715-fb3cfc091442',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.823+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478176004505611054/copy-of-5_5_blog-activity.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313478176004505611054/gtividhi-1-aaiisiittii-se-kyaa-taatpry-hai_1603367149738_do_31313478176004505611054_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313478176004505611054/gtividhi-1-aaiisiittii-se-kyaa-taatpry-hai_1603367149921_do_31313478176004505611054_1.0_spine.ecar',
                    'size': 34962
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 42988,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313478176004505611054/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478176004505611054/copy-of-5_5_blog-activity.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 37561
                },
                'lockKey': 'fc2eaa79-6dd4-421f-a66a-4a0df6637276',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313478176004505611054',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 2964228
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:45:49.733+0000',
                'size': 1391577,
                'name': 'गतिविधि १:  आईसीटी से क्या तात्पर्य है',
                'status': 'Live',
                'code': 'c61cc482-74db-414b-b111-a319515e9c4b',
                'prevStatus': 'Processing',
                'description': 'गतिविधि १:  आईसीटी से क्या तात्पर्य है',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478176004505611054/copy-of-5_5_blog-activity.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T11:41:54.069+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:45:49.508+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:53:11.856+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:45:49.979+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603367149508',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313478176004505611054/gtividhi-1-aaiisiittii-se-kyaa-taatpry-hai_1603367149738_do_31313478176004505611054_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T11:42:47.984+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155740161363',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:48:13.654+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478172178022411334/aaii.sii.ttii.-kii-avdhaarnnaa.mp4',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313478172178022411334/aaii.sii.ttii.-kii-avdhaarnnaa_1603367191607_do_31313478172178022411334_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'showNotification': true,
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313478172178022411334/aaii.sii.ttii.-kii-avdhaarnnaa_1603367204658_do_31313478172178022411334_1.0_spine.ecar',
                    'size': 34935
                  }
                },
                'mimeType': 'video/mp4',
                'me_totalRatingsCount': 107424,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313478172178022411334/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478172178022411334/aaii.sii.ttii.-kii-avdhaarnnaa.mp4',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 84600
                },
                'lockKey': '4dfa551f-3eea-4578-835e-ecd2299391f5',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313478172178022411334',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 16153955
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:46:31.601+0000',
                'size': 165118821,
                'name': 'आई.सी.टी. की अवधारणा',
                'status': 'Live',
                'code': 'c2266e13-a0bc-4d03-8e96-471dc59ec02a',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpprodmedia-inct.streaming.media.azure.net/7992aeeb-22bf-46ef-8251-d7e6cb32d133/aaii.sii.ttii.-kii-avdhaarnnaa.ism/manifest(format=m3u8-aapl-v3)',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T11:41:49.398+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:46:31.389+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:29:56.026+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:46:44.756+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603367191389',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313478172178022411334/aaii.sii.ttii.-kii-avdhaarnnaa_1603367191607_do_31313478172178022411334_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T11:44:18.595+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 1,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588155740161363',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:21:37.148+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313472227985817611976/5_7-aaii.sii.ttii.-kii-avdhaarnnaa-viiddiyo-prtilipi.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313472227985817611976/aaii.sii.ttii.-kii-avdhaarnnaa-viiddiyo-prtilipi_1603361634962_do_31313472227985817611976_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'showNotification': true,
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313472227985817611976/aaii.sii.ttii.-kii-avdhaarnnaa-viiddiyo-prtilipi_1603361635030_do_31313472227985817611976_1.0_spine.ecar',
                    'size': 34987
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 76227,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313472227985817611976/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313472227985817611976/5_7-aaii.sii.ttii.-kii-avdhaarnnaa-viiddiyo-prtilipi.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 60435
                },
                'lockKey': 'ef5f8253-279d-4e81-be0c-1a5b80bd2f54',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313472227985817611976',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 5413790
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T10:13:54.956+0000',
                'size': 70250,
                'name': 'आई.सी.टी. की अवधारणा - वीडियो प्रतिलिपि',
                'status': 'Live',
                'code': '11d5a063-c172-4508-a4e4-9b65b1512334',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313472227985817611976/5_7-aaii.sii.ttii.-kii-avdhaarnnaa-viiddiyo-prtilipi.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T09:40:53.304+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T10:13:54.810+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:23:46.635+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T10:13:55.092+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603361634810',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313472227985817611976/aaii.sii.ttii.-kii-avdhaarnnaa-viiddiyo-prtilipi_1603361634962_do_31313472227985817611976_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T09:50:03.048+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 3,
                'depth': 2,
                'parent': 'do_3131430588155740161363',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:16:26.123+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_31313458495336448011707-latest',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'plugins': [
                  {
                    'identifier': 'org.ekstep.stage',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.text',
                    'semanticVersion': '1.2'
                  },
                  {
                    'identifier': 'org.ekstep.questionset',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.questionset.quiz',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.iterator',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.navigation',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.questionunit',
                    'semanticVersion': '1.2'
                  },
                  {
                    'identifier': 'org.ekstep.questionunit.mcq',
                    'semanticVersion': '1.3'
                  }
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313458495336448011707/gtividhi-2-kyaa-yh-aaii.sii.ttii.-hai_1603348140122_do_31313458495336448011707_1.0.ecar',
                'channel': '0125196274181898243',
                'questions': [
                  {
                    'identifier': 'do_31313458879133286415736',
                    'name': 'डिजिटल समाचार पत्र\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313458849832140815831',
                    'name': 'टेलीफोन\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313458794273177615735',
                    'name': 'स्मार्ट टीवी\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313458762878976015828',
                    'name': 'रेडियो\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313458730025779215734',
                    'name': 'मेल\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313458667115315215733',
                    'name': 'बायोमेट्रिक सिस्टम\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313458618366361615732',
                    'name': 'मुद्रित पाठ्यपुस्तक\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  }
                ],
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313458495336448011707/gtividhi-2-kyaa-yh-aaii.sii.ttii.-hai_1603348140207_do_31313458495336448011707_1.0_spine.ecar',
                    'size': 35081
                  }
                },
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'editorState': '{"plugin":{"noOfExtPlugins":12,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.2"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"},{"plugin":"org.ekstep.richtext","version":"1.0"},{"plugin":"org.ekstep.iterator","version":"1.0"},{"plugin":"org.ekstep.navigation","version":"1.0"},{"plugin":"org.ekstep.reviewercomments","version":"1.0"},{"plugin":"org.ekstep.questionunit.mtf","version":"1.2"},{"plugin":"org.ekstep.keyboard","version":"1.1"},{"plugin":"org.ekstep.questionunit.sequence","version":"1.1"},{"plugin":"org.ekstep.questionunit.ftb","version":"1.1"},{"plugin":"org.ekstep.questionunit.mcq","version":"1.3"},{"plugin":"org.ekstep.questionunit.reorder","version":"1.1"}]},"stage":{"noOfStages":2,"currentStage":"d255b399-ce8c-4e09-8956-83e1db301411"},"sidebar":{"selectedMenu":"settings"}}',
                'me_totalRatingsCount': 85131,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313458495336448011707/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313458495336448011707/artifact/1603348140016_do_31313458495336448011707.zip',
                'contentEncoding': 'gzip',
                'me_totalPlaySessionCount': {
                  'portal': 142285
                },
                'lockKey': '401f1f90-e468-4cd9-8082-d15d4d90caf1',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313458495336448011707',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 6621984
                },
                'visibility': 'Default',
                'author': 'NCERT',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'rejectReasons': [
                  'Others'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'size': 121922,
                'lastPublishedOn': '2020-10-22T06:29:00.112+0000',
                'rejectComment': 'chunein spelling',
                'name': 'गतिविधि 2: क्या यह आई.सी.टी. है',
                'status': 'Live',
                'totalQuestions': 7,
                'code': 'org.sunbird.xOCeoc',
                'prevStatus': 'Processing',
                'description': '',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_31313458495336448011707-latest',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T05:01:29.816+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T06:28:58.857+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:15:23.327+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T06:29:01.148+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'displayScore': true,
                'totalScore': 7,
                'pkgVersion': 1,
                'versionKey': '1603348138857',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313458495336448011707/gtividhi-2-kyaa-yh-aaii.sii.ttii.-hai_1603348140122_do_31313458495336448011707_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T05:50:40.069+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 2,
                'usedByContent': [],
                'index': 4,
                'depth': 2,
                'parent': 'do_3131430588155740161363',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:07:26.668+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155740161363',
            'lastStatusChangedOn': '2020-11-03T04:21:36.824+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 3,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296823',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'सूचना एवं संचार  प्रौद्योगिकी क्या है',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 4,
            'leafNodes': [
              'do_31313478172178022411334',
              'do_31313458495336448011707',
              'do_31313478176004505611054',
              'do_31313472227985817611976'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '11f83ebc-3aae-429a-af09-e06dab25fb03',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.813+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478248306278411335/copy-of-5_9_blog-activity-refer.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313478248306278411335/gtividhi-3-suucnaa-evn-sncaar-tkniik-shikssnn-adhigm-aur-muulyaankn-men-kaise-shyog-krtaa-hai_1603367169531_do_31313478248306278411335_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313478248306278411335/gtividhi-3-suucnaa-evn-sncaar-tkniik-shikssnn-adhigm-aur-muulyaankn-men-kaise-shyog-krtaa-hai_1603367169743_do_31313478248306278411335_1.0_spine.ecar',
                    'size': 34978
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 41514,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313478248306278411335/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478248306278411335/copy-of-5_9_blog-activity-refer.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 33653
                },
                'lockKey': '8251884f-2e09-492a-a719-5b5b56b568ae',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313478248306278411335',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 2559590
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:46:09.526+0000',
                'size': 1435147,
                'name': 'गतिविधि 3: सूचना एवं संचार तकनीक  शिक्षण, अधिगम और  मूल्यांकन में कैसे सहयोग करता है?',
                'status': 'Live',
                'code': '1ebc16ec-c517-4ce1-8847-4ebeb835ee20',
                'prevStatus': 'Processing',
                'description': 'गतिविधि 3: सूचना एवं संचार तकनीक  शिक्षण, अधिगम और  मूल्यांकन में कैसे सहयोग करता है?',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313478248306278411335/copy-of-5_9_blog-activity-refer.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T11:43:22.327+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:46:09.269+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:39:06.700+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:46:09.804+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603367169269',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313478248306278411335/gtividhi-3-suucnaa-evn-sncaar-tkniik-shikssnn-adhigm-aur-muulyaankn-men-kaise-shyog-krtaa-hai_1603367169531_do_31313478248306278411335_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T11:44:18.862+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588154920961347',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:31:25.955+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588154920961347',
            'lastStatusChangedOn': '2020-11-03T04:21:36.813+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 4,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296813',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'सूचना एवं संचार कैसे अधिगम एवं शिक्षण में सहयोग करता है',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 1,
            'leafNodes': [
              'do_31313478248306278411335'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '04b08c08-f659-4a62-a2ab-8e8888b53f3b',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.828+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339686433587201844/5_10_content-pedagogy.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339686433587201844/shikssnn-saamgrii-shikssaa-shaastr-tteknolonjii-ko-kaise-ekiikrt-kiyaa-jaae_1603347262015_do_3131339686433587201844_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339686433587201844/shikssnn-saamgrii-shikssaa-shaastr-tteknolonjii-ko-kaise-ekiikrt-kiyaa-jaae_1603347262094_do_3131339686433587201844_1.0_spine.ecar',
                    'size': 35022
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 76648,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131339686433587201844/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339686433587201844/5_10_content-pedagogy.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 59716
                },
                'lockKey': '6e8dd6e8-9542-48ff-8403-3894f242a34e',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131339686433587201844',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 3483873
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'rejectReasons': [
                  'Others'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T06:14:22.009+0000',
                'size': 383572,
                'rejectComment': 'space between ki and ya',
                'name': 'शिक्षण सामग्री - शिक्षा शास्त्र- टेक्नोलॉजी को कैसे एकीकृत किया जाए',
                'status': 'Live',
                'code': 'd6ca5287-e827-4e47-9e47-b8b859e52b1a',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339686433587201844/5_10_content-pedagogy.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:07:36.661+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T06:14:21.851+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:47:42.860+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-22T06:14:22.162+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603347261851',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131339686433587201844/shikssnn-saamgrii-shikssaa-shaastr-tteknolonjii-ko-kaise-ekiikrt-kiyaa-jaae_1603347262015_do_3131339686433587201844_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T05:41:26.216+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:43:45.208+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339728289546241845/5_11_parameters-of-ict-integration.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339728289546241845/aaiisiittii-ko-ekiikrt-krte-smy-kin-maandnddon-pr-vicaar-kiyaa-jaanaa-caahie_1603273561989_do_3131339728289546241845_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339728289546241845/aaiisiittii-ko-ekiikrt-krte-smy-kin-maandnddon-pr-vicaar-kiyaa-jaanaa-caahie_1603273562200_do_3131339728289546241845_1.0_spine.ecar',
                    'size': 34988
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 76536,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131339728289546241845/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339728289546241845/5_11_parameters-of-ict-integration.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 51893
                },
                'lockKey': 'b5038a42-01c8-4258-996b-2d3b3ca978b7',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131339728289546241845',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 1885657
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:46:01.984+0000',
                'size': 290745,
                'name': 'आईसीटी को एकीकृत करते समय किन मानदंडों पर विचार किया जाना चाहिए',
                'status': 'Live',
                'code': '447017e3-83e4-48e1-a519-14d59c4b0679',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339728289546241845/5_11_parameters-of-ict-integration.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:16:07.597+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:46:01.795+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:28:18.528+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-21T09:46:02.269+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273561795',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131339728289546241845/aaiisiittii-ko-ekiikrt-krte-smy-kin-maandnddon-pr-vicaar-kiyaa-jaanaa-caahie_1603273561989_do_3131339728289546241845_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:20:21.528+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:21:26.850+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_313133975595655168155/5_12_nature-ofcontent.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_313133975595655168155/pairaamiittr-1-vissyvstu-kaa-svrup_1603273520308_do_313133975595655168155_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_313133975595655168155/pairaamiittr-1-vissyvstu-kaa-svrup_1603273520374_do_313133975595655168155_1.0_spine.ecar',
                    'size': 34944
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 76094,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_313133975595655168155/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_313133975595655168155/5_12_nature-ofcontent.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 51990
                },
                'lockKey': '551e0e59-bf1d-47b8-8d43-3d373ce408d9',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_313133975595655168155',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 6125827
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:45:20.305+0000',
                'size': 343233,
                'name': 'पैरामीटर 1 : विषयवस्तु का स्वरुप',
                'status': 'Live',
                'code': '09a2408a-001c-4b99-8aa6-d1729e336e2e',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_313133975595655168155/5_12_nature-ofcontent.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:21:45.330+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:45:20.152+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:43:01.573+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-21T09:45:20.424+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273520152',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_313133975595655168155/pairaamiittr-1-vissyvstu-kaa-svrup_1603273520308_do_313133975595655168155_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:24:13.672+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 3,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:39:50.286+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313397741881753611521/5_13_context.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313397741881753611521/pairaamiittr-2-sndrbh_1603273479578_do_31313397741881753611521_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313397741881753611521/pairaamiittr-2-sndrbh_1603273479667_do_31313397741881753611521_1.0_spine.ecar',
                    'size': 34925
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 76297,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313397741881753611521/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313397741881753611521/5_13_context.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 50821
                },
                'lockKey': '45e8a590-1226-4e62-a4f6-0670e274b50f',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313397741881753611521',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 5810887
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:44:39.575+0000',
                'size': 346050,
                'name': 'पैरामीटर 2 : संदर्भ',
                'status': 'Live',
                'code': 'a120d852-e172-483d-86b9-c13896a433c7',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313397741881753611521/5_13_context.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:25:27.884+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:44:39.313+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:44:50.266+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-21T09:44:39.792+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273479313',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313397741881753611521/pairaamiittr-2-sndrbh_1603273479578_do_31313397741881753611521_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:29:23.750+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 4,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:41:14.586+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339798579281921909/5_14_do-yourself.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339798579281921909/gtividhi-4-svyn-kre_1603273441730_do_3131339798579281921909_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339798579281921909/gtividhi-4-svyn-kre_1603273441791_do_3131339798579281921909_1.0_spine.ecar',
                    'size': 34927
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 77376,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131339798579281921909/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339798579281921909/5_14_do-yourself.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 49383
                },
                'lockKey': 'dd86c19f-02d6-43bc-ba76-5f78ff5693c4',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131339798579281921909',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 1627086
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:44:01.727+0000',
                'size': 289282,
                'name': 'गतिविधि 4 : स्वयं करे',
                'status': 'Live',
                'code': '65b2cea1-7618-4938-8b65-751d69b20734',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339798579281921909/5_14_do-yourself.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:30:25.627+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:44:01.580+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:40:29.032+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-21T09:44:01.839+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273441580',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131339798579281921909/gtividhi-4-svyn-kre_1603273441730_do_3131339798579281921909_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:32:15.666+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 5,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:37:51.551+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313398097120460811398/5_15_method-ofteaching-learning.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313398097120460811398/pairaamiittr-3-shikssnn-adhigm-kii-pddhti_1603273397929_do_31313398097120460811398_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313398097120460811398/pairaamiittr-3-shikssnn-adhigm-kii-pddhti_1603273398021_do_31313398097120460811398_1.0_spine.ecar',
                    'size': 34944
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 75117,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313398097120460811398/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313398097120460811398/5_15_method-ofteaching-learning.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 48898
                },
                'lockKey': 'b52b8c53-172c-4e3a-95d0-92b82a01f188',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313398097120460811398',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 2999434
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:43:17.926+0000',
                'size': 388736,
                'name': 'पैरामीटर 3: शिक्षण/ अधिगम की पद्धति',
                'status': 'Live',
                'code': '84476689-a3c9-431d-b6b9-43ded08e7c43',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313398097120460811398/5_15_method-ofteaching-learning.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:32:41.525+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:43:17.666+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:46:16.294+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-21T09:43:18.147+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273397666',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313398097120460811398/pairaamiittr-3-shikssnn-adhigm-kii-pddhti_1603273397929_do_31313398097120460811398_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:34:41.851+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 6,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:42:29.838+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339850007183361849/5_16_technology.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339850007183361849/maandndd-4-tkniikupkrnnii-saamgrii_1603273336598_do_3131339850007183361849_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131339850007183361849/maandndd-4-tkniikupkrnnii-saamgrii_1603273337003_do_3131339850007183361849_1.0_spine.ecar',
                    'size': 34951
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 69471,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131339850007183361849/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339850007183361849/5_16_technology.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 44858
                },
                'lockKey': '8ba90660-c6e4-4385-93a6-936f6d9ed2d1',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131339850007183361849',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 3532676
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T09:42:16.594+0000',
                'size': 542564,
                'name': 'मानदंड 4: तकनीक/उपकरण/ई-सामग्री',
                'status': 'Live',
                'code': '6973bc07-ad28-4769-a6ba-a2a2256b9bed',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131339850007183361849/5_16_technology.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T08:40:53.409+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T09:42:16.427+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:15:41.612+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-21T09:42:17.063+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603273336427',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131339850007183361849/maandndd-4-tkniikupkrnnii-saamgrii_1603273336598_do_3131339850007183361849_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T08:44:36.231+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 7,
                'depth': 2,
                'parent': 'do_3131430588156149761369',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:07:28.269+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588156149761369',
            'lastStatusChangedOn': '2020-11-03T04:21:36.828+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 5,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296828',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'शिक्षण सामग्री - शिक्षा शास्त्र- टेक्नोलॉजी को कैसे एकीकृत कि या जाए',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 7,
            'leafNodes': [
              'do_3131339686433587201844',
              'do_3131339798579281921909',
              'do_31313398097120460811398',
              'do_3131339850007183361849',
              'do_3131339728289546241845',
              'do_313133975595655168155',
              'do_31313397741881753611521'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': 'b6d79104-f23b-4786-ab59-98ff4b518ebc',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.822+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313483573434777611860/ict-rejaul-sir-ict-tools.mp4',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': '',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'showNotification': true,
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313483573434777611860/vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen_1603374511644_do_31313483573434777611860_1.0_spine.ecar',
                    'size': 35018
                  }
                },
                'mimeType': 'video/mp4',
                'me_totalRatingsCount': 121747,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313483573434777611860/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313483573434777611860/ict-rejaul-sir-ict-tools.mp4',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 86850
                },
                'lockKey': '508d8fbb-68c8-45e8-93b8-c5d4d4e77978',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313483573434777611860',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 29957225
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T13:48:26.959+0000',
                'name': 'विभिन्न आई.सी.टी. उपकरणों / तकनीकों का पता लगाएँ',
                'status': 'Live',
                'code': '84ab83ae-e568-4ede-bcda-46bac25bc5eb',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpprodmedia-inct.streaming.media.azure.net/52874bf8-15f9-4122-9a20-98e463a642af/ict-rejaul-sir-ict-tools.ism/manifest(format=m3u8-aapl-v3)',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T13:31:42.729+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'online-only',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T13:48:26.832+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:40:37.834+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T13:48:31.706+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603374506832',
                'idealScreenDensity': 'hdpi',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T13:40:47.654+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 1,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155658241361',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:37:54.565+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313483394648473611208/5_18-vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen-viiddiyo-prtilipi.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313483394648473611208/vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen-viiddiyo-prtilipi_1603374486967_do_31313483394648473611208_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'showNotification': true,
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313483394648473611208/vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen-viiddiyo-prtilipi_1603374487006_do_31313483394648473611208_1.0_spine.ecar',
                    'size': 35034
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 86052,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313483394648473611208/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313483394648473611208/5_18-vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen-viiddiyo-prtilipi.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 61101
                },
                'lockKey': '16835b3f-30bf-401c-a1ab-a3d477d1cecb',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313483394648473611208',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 8403981
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T13:48:06.962+0000',
                'size': 121758,
                'name': 'विभिन्न आई.सी.टी. उपकरणों / तकनीकों का पता लगाएँ - वीडियो प्रतिलिपि',
                'status': 'Live',
                'code': 'dc9965cc-2da3-4335-9d48-982deedd4255',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313483394648473611208/5_18-vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen-viiddiyo-prtilipi.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T13:28:04.484+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T13:48:06.821+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:57:55.864+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T13:48:07.073+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603374486821',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313483394648473611208/vibhinn-aaii.sii.ttii.-upkrnnon-tkniikon-kaa-ptaa-lgaaen-viiddiyo-prtilipi_1603374486967_do_31313483394648473611208_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T13:30:31.083+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588155658241361',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:52:13.621+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/h5p/do_3131345828580229121941-latest',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131345828580229121941/atirikt-gtividhi-aaii.sii.ttii.-phlon-kaa-anvessnn-kren_1603344768971_do_3131345828580229121941_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131345828580229121941/atirikt-gtividhi-aaii.sii.ttii.-phlon-kaa-anvessnn-kren_1603344769235_do_3131345828580229121941_1.0_spine.ecar',
                    'size': 34963
                  }
                },
                'mimeType': 'application/vnd.ekstep.h5p-archive',
                'me_totalRatingsCount': 293914,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131345828580229121941/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131345828580229121941/artifact/1603342635480_do_3131345828580229121941.zip',
                'contentEncoding': 'gzip',
                'me_totalPlaySessionCount': {
                  'portal': 187977
                },
                'lockKey': '522a78e2-8665-4740-906a-318b297ce1d3',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131345828580229121941',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 7286925
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T05:32:48.962+0000',
                'size': 1148775,
                'name': 'अतिरिक्त गतिविधि: आई.सी.टी. पहलों का अन्वेषण करें',
                'status': 'Live',
                'code': '96a29396-5a01-46e3-b360-8305c097c738',
                'prevStatus': 'Processing',
                'medium': [
                  'Hindi'
                ],
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/h5p/do_3131345828580229121941-latest',
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T04:57:14.037+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T05:32:48.822+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:35:17.885+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-22T05:32:52.347+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603344768822',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131345828580229121941/atirikt-gtividhi-aaii.sii.ttii.-phlon-kaa-anvessnn-kren_1603344768971_do_3131345828580229121941_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T04:59:31.893+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 3,
                'depth': 2,
                'parent': 'do_3131430588155658241361',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:34:52.402+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155658241361',
            'lastStatusChangedOn': '2020-11-03T04:21:36.822+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 6,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296822',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'किस प्रौद्योगिकी आई.सी.टी का उपयोग किया जाना चाहिए',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 3,
            'leafNodes': [
              'do_31313483394648473611208',
              'do_3131345828580229121941',
              'do_31313483573434777611860'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': 'c7375bbd-ace4-45a4-bca3-8569f1c1bb50',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.816+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313474605245235212030/ict-indu-mam.mp4',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': '',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313474605245235212030/ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth_1603365746467_do_31313474605245235212030_1.0_spine.ecar',
                    'size': 34997
                  }
                },
                'mimeType': 'video/mp4',
                'me_totalRatingsCount': 111648,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313474605245235212030/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313474605245235212030/ict-indu-mam.mp4',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 83020
                },
                'lockKey': '720d7756-d687-4fd6-9bc4-0892a34f7519',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'identifier': 'do_31313474605245235212030',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 19352070
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:22:26.461+0000',
                'name': 'डिजिटल शिक्षा: स्कूली शिक्षा के लिए निहितार्थ',
                'status': 'Live',
                'code': '69615038-9bbb-4a6e-8c0c-d34377769525',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpprodmedia-inct.streaming.media.azure.net/ed4fdae7-2943-4288-a4f6-b7a1d6cb7661/ict-indu-mam.ism/manifest(format=m3u8-aapl-v3)',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T10:29:15.232+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'online-only',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:22:26.260+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:23:23.179+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:22:26.505+0000',
                'creator': 'NCERT COURSE CREATOR 1',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603365746260',
                'idealScreenDensity': 'hdpi',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T10:48:51.006+0000',
                'createdBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'compatibilityLevel': 1,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155166721351',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:15:52.070+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131347275282268161289/5_21-ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth-viiddiyo-prtilipii.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131347275282268161289/ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth-viiddiyo-prtilipii_1603361615254_do_3131347275282268161289_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'showNotification': true,
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131347275282268161289/ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth-viiddiyo-prtilipii_1603361615298_do_3131347275282268161289_1.0_spine.ecar',
                    'size': 35033
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 74964,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131347275282268161289/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131347275282268161289/5_21-ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth-viiddiyo-prtilipii.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 56120
                },
                'lockKey': '9ad8b57b-aff5-494d-8848-fefec5abab0c',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131347275282268161289',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 5471464
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T10:13:35.249+0000',
                'size': 142728,
                'name': 'डिजिटल शिक्षा: स्कूली शिक्षा के लिए निहितार्थ - वीडियो प्रतिलिपी',
                'status': 'Live',
                'code': 'a70332d0-b362-480e-8bb6-790dc4640d51',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131347275282268161289/5_21-ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth-viiddiyo-prtilipii.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T09:51:33.974+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T10:13:34.990+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:42:41.846+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-22T10:13:35.399+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603361614990',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131347275282268161289/ddijittl-shikssaa-skuulii-shikssaa-ke-lie-nihitaarth-viiddiyo-prtilipii_1603361615254_do_3131347275282268161289_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T09:58:23.749+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588155166721351',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:39:23.593+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313402698105651211544/5_22_planning-digitalsession.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313402698105651211544/gtividhi-5-ddijittl-str-kii-yojnaa-bnaanaa_1603278224407_do_31313402698105651211544_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313402698105651211544/gtividhi-5-ddijittl-str-kii-yojnaa-bnaanaa_1603278224473_do_31313402698105651211544_1.0_spine.ecar',
                    'size': 34951
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 77010,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313402698105651211544/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313402698105651211544/5_22_planning-digitalsession.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 49150
                },
                'lockKey': 'd6ce7337-673c-40ae-b135-17470781874e',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313402698105651211544',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 1641411
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T11:03:44.403+0000',
                'size': 289336,
                'name': 'गतिविधि 5: डिजिटल सत्र की योजना बनाना',
                'status': 'Live',
                'code': 'ed42ca75-a336-4d33-b6a7-c31abb37d095',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313402698105651211544/5_22_planning-digitalsession.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T10:06:17.962+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T11:03:44.248+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:01:31.764+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-21T11:03:44.523+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603278224248',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313402698105651211544/gtividhi-5-ddijittl-str-kii-yojnaa-bnaanaa_1603278224407_do_31313402698105651211544_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T10:07:52.766+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 3,
                'depth': 2,
                'parent': 'do_3131430588155166721351',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:55:31.267+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313475711469158411171/ict-rejaul-sir.mp4',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313475711469158411171/onnlaain-shikssnn-ke-dauraan-surkssaa-bcaav-aur-gopniiytaa_1603365731408_do_31313475711469158411171_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313475711469158411171/onnlaain-shikssnn-ke-dauraan-surkssaa-bcaav-aur-gopniiytaa_1603365744853_do_31313475711469158411171_1.0_spine.ecar',
                    'size': 34952
                  }
                },
                'mimeType': 'video/mp4',
                'me_totalRatingsCount': 96532,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313475711469158411171/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313475711469158411171/ict-rejaul-sir.mp4',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 64668
                },
                'lockKey': '193b3cc6-432f-4b82-98df-b7e0ba6384e5',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'identifier': 'do_31313475711469158411171',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 12292446
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:22:11.354+0000',
                'size': 180095312,
                'name': 'ऑनलाइन शिक्षण के दौरान सुरक्षा , बचाव और गोपनीयता',
                'status': 'Live',
                'code': '4eb0a39e-2cba-4e9e-a5c1-b235ce3ca413',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpprodmedia-inct.streaming.media.azure.net/27cf3cb1-ebac-4a91-bcdc-75654221792f/ict-rejaul-sir.ism/manifest(format=m3u8-aapl-v3)',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T10:51:45.603+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:22:11.235+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:17:45.233+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:22:24.943+0000',
                'creator': 'NCERT COURSE CREATOR 1',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603365731235',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313475711469158411171/onnlaain-shikssnn-ke-dauraan-surkssaa-bcaav-aur-gopniiytaa_1603365731408_do_31313475711469158411171_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T11:09:05.668+0000',
                'createdBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'compatibilityLevel': 1,
                'resourceType': 'Learn',
                'index': 4,
                'depth': 2,
                'parent': 'do_3131430588155166721351',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:09:44.933+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313476933029068811835/5_24.pdf',
                'keywords': [
                  'ऑनलाइन शिक्षण के दौरान सुरक्षा , बचाव और गोपनीयता'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313476933029068811835/onnlaain-shikssnn-ke-dauraan-surkssaa-bcaav-aur-gopniiytaa_-viiddiyo-prtilipi_1603365769617_do_31313476933029068811835_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313476933029068811835/onnlaain-shikssnn-ke-dauraan-surkssaa-bcaav-aur-gopniiytaa_-viiddiyo-prtilipi_1603365769664_do_31313476933029068811835_1.0_spine.ecar',
                    'size': 34874
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 79980,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313476933029068811835/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313476933029068811835/5_24.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 51122
                },
                'lockKey': '603fc678-5599-4073-9940-b81a68a8983e',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'identifier': 'do_31313476933029068811835',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 3690831
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:22:49.592+0000',
                'size': 119164,
                'name': 'ऑनलाइन शिक्षण के दौरान सुरक्षा , बचाव और गोपनीयता_-वीडियो प्रतिलिपि',
                'status': 'Live',
                'code': '27789ec8-9953-4099-b151-0e82599890ba',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313476933029068811835/5_24.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T11:16:36.765+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:22:49.430+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:43:19.329+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:22:49.722+0000',
                'creator': 'NCERT COURSE CREATOR 1',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603365769430',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313476933029068811835/onnlaain-shikssnn-ke-dauraan-surkssaa-bcaav-aur-gopniiytaa_-viiddiyo-prtilipi_1603365769617_do_31313476933029068811835_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T11:17:48.682+0000',
                'createdBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 5,
                'depth': 2,
                'parent': 'do_3131430588155166721351',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:39:45.042+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/h5p/do_31313477350508134412125-latest',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313477350508134412125/gtividhi-6-onnlaain-rhte-hue-surkssaa-aur-surkssaa-ke-upaay_1603366125887_do_31313477350508134412125_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313477350508134412125/gtividhi-6-onnlaain-rhte-hue-surkssaa-aur-surkssaa-ke-upaay_1603366126079_do_31313477350508134412125_1.0_spine.ecar',
                    'size': 34975
                  }
                },
                'mimeType': 'application/vnd.ekstep.h5p-archive',
                'me_totalRatingsCount': 313189,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313477350508134412125/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313477350508134412125/artifact/1603365908276_do_31313477350508134412125.zip',
                'contentEncoding': 'gzip',
                'me_totalPlaySessionCount': {
                  'portal': 157785
                },
                'lockKey': '8586ab49-3f57-4e38-8de8-74bb444b17b2',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'identifier': 'do_31313477350508134412125',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 7434649
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T11:28:45.882+0000',
                'size': 1020345,
                'name': 'गतिविधि 6: ऑनलाइन रहते हुए सुरक्षा और सुरक्षा के उपाय',
                'status': 'Live',
                'code': '72a99ce5-b331-4800-a996-9239b2b58493',
                'prevStatus': 'Processing',
                'medium': [
                  'Hindi'
                ],
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/h5p/do_31313477350508134412125-latest',
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T11:25:06.383+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T11:28:45.753+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:56:51.478+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T11:28:48.143+0000',
                'creator': 'NCERT COURSE CREATOR 1',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603366125753',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313477350508134412125/gtividhi-6-onnlaain-rhte-hue-surkssaa-aur-surkssaa-ke-upaay_1603366125887_do_31313477350508134412125_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T11:26:35.428+0000',
                'createdBy': 'c83f8dfb-e2fd-4b5c-9067-eb367dcd4ddf',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 6,
                'depth': 2,
                'parent': 'do_3131430588155166721351',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:51:21.209+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155166721351',
            'lastStatusChangedOn': '2020-11-03T04:21:36.816+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 7,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296816',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'ऑनलाइन शिक्षण',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 6,
            'leafNodes': [
              'do_3131347275282268161289',
              'do_31313475711469158411171',
              'do_31313476933029068811835',
              'do_31313402698105651211544',
              'do_31313474605245235212030',
              'do_31313477350508134412125'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '1a2afa8c-5f30-489f-ab23-2aac42a3bee5',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.821+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313402816037683211431/5_26_exemplar.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313402816037683211431/vissy-saamgrii-praudyogikii-ekiikrnn-ek-udaahrnn_1603278197671_do_31313402816037683211431_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313402816037683211431/vissy-saamgrii-praudyogikii-ekiikrnn-ek-udaahrnn_1603278197915_do_31313402816037683211431_1.0_spine.ecar',
                    'size': 34944
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 87674,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313402816037683211431/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313402816037683211431/5_26_exemplar.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 56119
                },
                'lockKey': 'b4198270-17c1-4080-9782-cca741cccebc',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313402816037683211431',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 5129266
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T11:03:17.667+0000',
                'size': 1780524,
                'name': 'विषय-सामग्री - प्रौद्योगिकी एकीकरण: एक उदाहरण',
                'status': 'Live',
                'code': 'c2402b30-c5a6-4778-a688-b826565a3655',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313402816037683211431/5_26_exemplar.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T10:08:41.922+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T11:03:17.441+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:04:45.158+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-21T11:03:17.991+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603278197441',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313402816037683211431/vissy-saamgrii-praudyogikii-ekiikrnn-ek-udaahrnn_1603278197671_do_31313402816037683211431_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T10:10:11.970+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155576321359',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:58:41.645+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155576321359',
            'lastStatusChangedOn': '2020-11-03T04:21:36.821+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 8,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296821',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'विषयवस्तु-शिक्षाशास्त्र-तकनीक के समन्वय पर आधारित सेशन की योजना',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 1,
            'leafNodes': [
              'do_31313402816037683211431'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': 'a8e5fba9-4a82-4294-bb1e-9bd8efc65cba',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.814+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131340293650841601930/5_27_ict_summary.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131340293650841601930/saaraansh_1603278168731_do_3131340293650841601930_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131340293650841601930/saaraansh_1603278168900_do_3131340293650841601930_1.0_spine.ecar',
                    'size': 34904
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 80798,
                'gradeLevel': [
                  'Others'
                ],
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131340293650841601930/artifact/nishtha_icon.thumb.jpg',
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131340293650841601930/5_27_ict_summary.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 49038
                },
                'lockKey': '7daa5b2f-0263-455b-91d2-d0905396b368',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131340293650841601930',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 2379754
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T11:02:48.726+0000',
                'size': 812581,
                'name': 'सारांश',
                'status': 'Draft',
                'code': '43e256e8-337a-4da0-927a-4a799987eb4a',
                'prevStatus': 'Live',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131340293650841601930/5_27_ict_summary.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T10:11:08.981+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T11:02:48.512+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:10:47.824+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-22T05:26:30.016+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603344390132',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131340293650841601930/saaraansh_1603278168731_do_3131340293650841601930_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T10:12:32.171+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155002881349',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:03:30.174+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155002881349',
            'lastStatusChangedOn': '2020-11-03T04:21:36.814+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 9,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296814',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'सारांश',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 1,
            'leafNodes': [
              'do_3131340293650841601930'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': 'cf781e10-81d5-4a06-9267-84f414c2d777',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.817+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313459126286745611582/5_28_portfolio-activity.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार  प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313459126286745611582/porttpholiyo-gtividhiek-aaii.sii.ttii-ekiikrt-str-yojnaa-kii-yojnaa-bnaanaa_1603344801618_do_31313459126286745611582_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313459126286745611582/porttpholiyo-gtividhiek-aaii.sii.ttii-ekiikrt-str-yojnaa-kii-yojnaa-bnaanaa_1603344801682_do_31313459126286745611582_1.0_spine.ecar',
                    'size': 34972
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 75848,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313459126286745611582/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313459126286745611582/5_28_portfolio-activity.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 46305
                },
                'lockKey': '56739a15-8258-4d67-a299-c9079c3621df',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313459126286745611582',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 1722510
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-22T05:33:21.612+0000',
                'size': 156707,
                'name': 'पोर्टफ़ोलियो गतिविधि:एक आई.सी.टी एकीकृत सत्र योजना की योजना बनाना',
                'status': 'Live',
                'code': '7ae4e22e-c55b-4729-ad9c-ce167bb06ee7',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313459126286745611582/5_28_portfolio-activity.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-22T05:14:20.019+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-22T05:33:21.433+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:47:17.460+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-22T05:33:21.747+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603344801433',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313459126286745611582/porttpholiyo-gtividhiek-aaii.sii.ttii-ekiikrt-str-yojnaa-kii-yojnaa-bnaanaa_1603344801618_do_31313459126286745611582_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-22T05:16:00.936+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155248641353',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:43:11.471+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155248641353',
            'lastStatusChangedOn': '2020-11-03T04:21:36.817+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 10,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296817',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'पोर्टफ़ोलियो गतिविधि',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 1,
            'leafNodes': [
              'do_31313459126286745611582'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '7ede0321-7fd7-41ee-bc51-837290bab305',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.818+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131340323801907201134/5_29_tools-forteachers.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131340323801907201134/shiksskon-ke-lie-upkrnn_1603278061353_do_3131340323801907201134_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131340323801907201134/shiksskon-ke-lie-upkrnn_1603278061404_do_3131340323801907201134_1.0_spine.ecar',
                    'size': 34926
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 70926,
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131340323801907201134/artifact/nishtha_icon.thumb.jpg',
                'gradeLevel': [
                  'Others'
                ],
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131340323801907201134/5_29_tools-forteachers.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 47112
                },
                'lockKey': 'da6c784e-a06b-4add-a025-be5dbf5517f8',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131340323801907201134',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 1099444
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T11:01:01.350+0000',
                'size': 149498,
                'name': 'शिक्षकों के लिए उपकरण',
                'status': 'Draft',
                'code': 'ebebcbe3-5a26-4982-b952-37e309239077',
                'prevStatus': 'Live',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_3131340323801907201134/5_29_tools-forteachers.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T10:17:17.036+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T11:01:01.199+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:59:55.378+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-22T05:23:08.119+0000',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603344188203',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131340323801907201134/shiksskon-ke-lie-upkrnn_1603278061353_do_3131340323801907201134_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T10:18:48.365+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155330561355',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:54:15.058+0000',
                'languageCode': [
                  'en'
                ]
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313403369611264011448/5_30_weblinks.pdf',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय'
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313403369611264011448/veb-link_1603278020445_do_31313403369611264011448_1.0.ecar',
                'channel': '0125196274181898243',
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_31313403369611264011448/veb-link_1603278020494_do_31313403369611264011448_1.0_spine.ecar',
                    'size': 34911
                  }
                },
                'mimeType': 'application/pdf',
                'me_totalRatingsCount': 81275,
                'gradeLevel': [
                  'Others'
                ],
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31313403369611264011448/artifact/nishtha_icon.thumb.jpg',
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313403369611264011448/5_30_weblinks.pdf',
                'contentEncoding': 'identity',
                'me_totalPlaySessionCount': {
                  'portal': 43014
                },
                'lockKey': '9b2c5d4f-8c9e-4c0a-ad73-048c4fc25d2d',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_31313403369611264011448',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 1960219
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'pragma': [
                  'external'
                ],
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'lastPublishedOn': '2020-10-21T11:00:20.441+0000',
                'size': 153722,
                'name': 'वेब लिंक',
                'status': 'Live',
                'code': '13a26829-1b47-4215-8cd1-0b4678ed21ad',
                'prevStatus': 'Processing',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31313403369611264011448/5_30_weblinks.pdf',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T10:19:57.671+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T11:00:20.286+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:59:50.125+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'lastStatusChangedOn': '2020-10-21T11:00:20.562+0000',
                'creator': 'NCERT COURSE CREATOR 2',
                'os': [
                  'All'
                ],
                'pkgVersion': 1,
                'versionKey': '1603278020286',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_31313403369611264011448/veb-link_1603278020445_do_31313403369611264011448_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T10:21:12.901+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 4,
                'resourceType': 'Learn',
                'index': 2,
                'depth': 2,
                'parent': 'do_3131430588155330561355',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:54:02.222+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588155330561355',
            'lastStatusChangedOn': '2020-11-03T04:21:36.818+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 11,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296818',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'अतिरिक्त संसाधन',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 2,
            'leafNodes': [
              'do_3131340323801907201134',
              'do_31313403369611264011448'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'NCERT',
            'code': '4a8fd09b-d75c-4e66-965a-75ebc6d7e518',
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.830+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'NCERT',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_3131340162837626881924-latest',
                'keywords': [
                  'शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी. (सूचना एवं संचार प्रौद्योगिकी) का समन्वय'
                ],
                'plugins': [
                  {
                    'identifier': 'org.ekstep.stage',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.questionset',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.navigation',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.questionunit',
                    'semanticVersion': '1.2'
                  },
                  {
                    'identifier': 'org.ekstep.questionunit.mcq',
                    'semanticVersion': '1.3'
                  },
                  {
                    'identifier': 'org.ekstep.questionset.quiz',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.iterator',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.summary',
                    'semanticVersion': '1.0'
                  }
                ],
                'subject': [
                  'CPD'
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131340162837626881924/prshnottrii_1603278256479_do_3131340162837626881924_1.0.ecar',
                'channel': '0125196274181898243',
                'questions': [
                  {
                    'identifier': 'do_31313402126972518415680',
                    'name': 'निम्नलिखित में से कौन सा कथन सत्य नहीं है\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313402085494784015585',
                    'name': 'ई -पाठशाला है\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313402038503014415584',
                    'name': 'एक फ्री और ओपन-सोर्स सॉफ्टवेयर है\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313401988265574415679',
                    'name': 'आईसीटी समेकित शिक्षण के लिए विषय-वस्तु विश्लेषण की क्या आवश्यकता है ?\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313401946929561615583',
                    'name': 'ओपन एजुकेशनल रिसोर्स (OER) हैं\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313401899026841615582',
                    'name': 'ई - सामग्री है\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313401850309836815678',
                    'name': 'आई सी टी कैसे अधिगम, शिक्षण और मूल्यांकन में सहयोग देता है?\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313401746817843215581',
                    'name': 'आई सी टी सम्बंधित नहीं है?\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313401697155481615676',
                    'name': 'अधिगम एवं शिक्षण के लिए आई सी टी क्यों महत्वपूर्ण है?\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  },
                  {
                    'identifier': 'do_31313402168443699215681',
                    'name': 'ई - सामग्री निर्माण के नि: शुल्क एवं ओपन सोर्स सॉफ्टवेयर/मंच है-\n',
                    'objectType': 'AssessmentItem',
                    'relation': 'associatedTo',
                    'status': 'Live'
                  }
                ],
                'organisation': [
                  'NCERT'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131340162837626881924/prshnottrii_1603278256526_do_3131340162837626881924_1.0_spine.ecar',
                    'size': 35024
                  }
                },
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'editorState': '{"plugin":{"noOfExtPlugins":12,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.2"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"},{"plugin":"org.ekstep.richtext","version":"1.0"},{"plugin":"org.ekstep.iterator","version":"1.0"},{"plugin":"org.ekstep.navigation","version":"1.0"},{"plugin":"org.ekstep.reviewercomments","version":"1.0"},{"plugin":"org.ekstep.questionunit.mtf","version":"1.2"},{"plugin":"org.ekstep.questionunit.mcq","version":"1.3"},{"plugin":"org.ekstep.keyboard","version":"1.1"},{"plugin":"org.ekstep.questionunit.reorder","version":"1.1"},{"plugin":"org.ekstep.questionunit.sequence","version":"1.1"},{"plugin":"org.ekstep.questionunit.ftb","version":"1.1"}]},"stage":{"noOfStages":1,"currentStage":"b3c26b5c-72e1-42b1-9025-bc7a24c58260","selectedPluginObject":"1b6aea3e-6909-4007-9641-19285de85be7"},"sidebar":{"selectedMenu":"settings"}}',
                'me_totalRatingsCount': 152590,
                'gradeLevel': [
                  'Others'
                ],
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131340162837626881924/artifact/nishtha_icon.thumb.jpg',
                'primaryCategory': 'Practice Question Set',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131340162837626881924/artifact/1603278256377_do_3131340162837626881924.zip',
                'contentEncoding': 'gzip',
                'me_totalPlaySessionCount': {
                  'portal': 90484
                },
                'lockKey': 'b034134f-36fd-4afa-82e8-d8d75ec43e06',
                'contentType': 'PracticeResource',
                'lastUpdatedBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'identifier': 'do_3131340162837626881924',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 11824008
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'author': 'NCERT',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '07c55d36-d8c0-4933-a7e3-6b4327dbaa82',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY-SA 4.0',
                'size': 153661,
                'lastPublishedOn': '2020-10-21T11:04:16.474+0000',
                'name': 'प्रश्नोत्तरी',
                'status': 'Draft',
                'totalQuestions': 10,
                'code': 'org.sunbird.4nEwPV',
                'prevStatus': 'Live',
                'description': '',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_3131340162837626881924-latest',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130894493734584321314/artifact/nishtha_icon.jpg',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-21T09:44:32.140+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-21T11:04:15.083+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T21:43:15.019+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '0125196274181898243'
                ],
                'creator': 'NCERT COURSE CREATOR 2',
                'lastStatusChangedOn': '2020-10-22T05:18:56.577+0000',
                'os': [
                  'All'
                ],
                'displayScore': true,
                'totalScore': 10,
                'pkgVersion': 1,
                'versionKey': '1604402142360',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131340162837626881924/prshnottrii_1603278256479_do_3131340162837626881924_1.0.ecar',
                'framework': 'ncert_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-21T09:57:51.270+0000',
                'createdBy': '182a349f-11dd-44f6-a85d-3464ad04667b',
                'compatibilityLevel': 2,
                'usedByContent': [],
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588156313601371',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T21:39:44.251+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_3131430588156313601371',
            'lastStatusChangedOn': '2020-11-03T04:21:36.830+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 12,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1604377296830',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'प्रश्नोत्तरी',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 1,
            'leafNodes': [
              'do_3131340162837626881924'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_3131430588146155521345',
            'copyright': 'सहज | SAHAJ',
            'code': '32ffbba2-002a-4c00-a7fb-21d1818a68ad',
            'credentials': {
              'enabled': 'No'
            },
            'channel': '0123221758376673287017',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-11-03T04:21:36.820+0000',
            'objectType': 'Content',
            'primaryCategory': 'Course Unit',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'copyright': 'सहज | SAHAJ',
                'previewUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_3131292436049264641492-latest',
                'subject': [
                  'In-service Trainings'
                ],
                'plugins': [
                  {
                    'identifier': 'org.ekstep.stage',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.text',
                    'semanticVersion': '1.2'
                  },
                  {
                    'identifier': 'org.ekstep.shape',
                    'semanticVersion': '1.0'
                  },
                  {
                    'identifier': 'org.ekstep.navigation',
                    'semanticVersion': '1.0'
                  }
                ],
                'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131292436049264641492/up_support_nishtha_1602691510047_do_3131292436049264641492_1.0.ecar',
                'channel': '01246376237871104093',
                'organisation': [
                  'सहज | SAHAJ'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131292436049264641492/up_support_nishtha_1602691510097_do_3131292436049264641492_1.0_spine.ecar',
                    'size': 5064
                  }
                },
                'mimeType': 'application/vnd.ekstep.ecml-archive',
                'editorState': '{"plugin":{"noOfExtPlugins":12,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.2"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"},{"plugin":"org.ekstep.richtext","version":"1.0"},{"plugin":"org.ekstep.iterator","version":"1.0"},{"plugin":"org.ekstep.navigation","version":"1.0"},{"plugin":"org.ekstep.reviewercomments","version":"1.0"},{"plugin":"org.ekstep.questionunit.mtf","version":"1.2"},{"plugin":"org.ekstep.questionunit.mcq","version":"1.3"},{"plugin":"org.ekstep.keyboard","version":"1.1"},{"plugin":"org.ekstep.questionunit.reorder","version":"1.1"},{"plugin":"org.ekstep.questionunit.sequence","version":"1.1"},{"plugin":"org.ekstep.questionunit.ftb","version":"1.1"}]},"stage":{"noOfStages":1,"currentStage":"8bd13d85-5ebe-4233-a818-5e5762642763"},"sidebar":{"selectedMenu":"settings"}}',
                'me_totalRatingsCount': 413655,
                'gradeLevel': [
                  'Class 3'
                ],
                'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131292436049264641492/artifact/1467187982567s.thumb.png',
                'primaryCategory': 'Explanation Content',
                'appId': 'prod.diksha.app',
                'artifactUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131292436049264641492/artifact/1602691509890_do_3131292436049264641492.zip',
                'contentEncoding': 'gzip',
                'me_totalPlaySessionCount': {
                  'portal': 137671
                },
                'lockKey': '4babc551-46f8-4e1b-b571-b551b8b927ef',
                'contentType': 'ExplanationResource',
                'lastUpdatedBy': '87ce3810-6b3d-4427-bfb7-efe57b7efbd5',
                'identifier': 'do_3131292436049264641492',
                'audience': [
                  'Student'
                ],
                'me_totalTimeSpentInSec': {
                  'portal': 3736383
                },
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': 'e7895aa9-4fcb-4155-b370-298c9eabb773',
                'version': 2,
                'prevState': 'Review',
                'license': 'CC BY 4.0',
                'size': 13648,
                'lastPublishedOn': '2020-10-14T16:05:10.042+0000',
                'name': 'UP_Support_Nishtha',
                'status': 'Live',
                'totalQuestions': 0,
                'code': 'org.sunbird.9MTGs1',
                'prevStatus': 'Processing',
                'description': 'Enter description for Resource',
                'streamingUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_3131292436049264641492-latest',
                'medium': [
                  'Hindi'
                ],
                'posterImage': 'https://ekstep-public-prod.s3-ap-south-1.amazonaws.com/content/1467187982567s.png',
                'idealScreenSize': 'normal',
                'createdOn': '2020-10-14T15:54:29.744+0000',
                'copyrightYear': 2020,
                'contentDisposition': 'inline',
                'licenseterms': 'By creating any type of content (resources, books, courses etc.) on DIKSHA, you consent to publish it under the Creative Commons License Framework. Please choose the applicable creative commons license you wish to apply to your content.',
                'lastUpdatedOn': '2020-10-14T16:05:09.526+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2020-11-02T22:37:05.071+0000',
                'dialcodeRequired': 'No',
                'createdFor': [
                  '01246376237871104093'
                ],
                'creator': 'Nishtha_creator_UP',
                'lastStatusChangedOn': '2020-10-14T16:05:10.315+0000',
                'os': [
                  'All'
                ],
                'totalScore': 0,
                'pkgVersion': 1,
                'versionKey': '1602691509526',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_3131292436049264641492/up_support_nishtha_1602691510047_do_3131292436049264641492_1.0.ecar',
                'framework': 'up_k-12',
                'me_averageRating': 4,
                'lastSubmittedOn': '2020-10-14T16:04:33.356+0000',
                'createdBy': '87ce3810-6b3d-4427-bfb7-efe57b7efbd5',
                'compatibilityLevel': 2,
                'board': 'State (Uttar Pradesh)',
                'resourceType': 'Learn',
                'index': 1,
                'depth': 2,
                'parent': 'do_3131430588155494401357',
                'objectType': 'Content',
                'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-17T22:28:38.673+0000',
                'languageCode': [
                  'en'
                ]
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'trackable': {
              'enabled': 'No',
              'autoBatch': 'No'
            },
            'identifier': 'do_3131430588155494401357',
            'lastStatusChangedOn': '2020-11-03T04:21:36.820+0000',
            'audience': [
              'Teacher'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 13,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'version': 2,
            'versionKey': '1604377296820',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'TPD',
            'depth': 1,
            'name': 'Support',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
            'pkgVersion': 1,
            'leafNodesCount': 1,
            'leafNodes': [
              'do_3131292436049264641492'
            ],
            'downloadUrl': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470928_do_3131430588146155521345_1.0_online.ecar","size":32699.0},"spine":{"ecarUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar","size":1104989.0}}'
          }
        ],
        'appId': 'prod.diksha.app',
        'contentEncoding': 'gzip',
        'lockKey': '50342dd9-464c-4ab1-83d4-7baaaf1d1dd5',
        'totalCompressedSize': 463098443,
        'mimeTypesCount': '{"application/vnd.ekstep.h5p-archive":2,"application/pdf":22,"application/vnd.ekstep.content-collection":13,"application/vnd.ekstep.ecml-archive":3,"video/mp4":5}',
        'sYS_INTERNAL_LAST_UPDATED_ON': '2020-11-04T19:00:02.228+0000',
        'contentType': 'Course',
        'trackable': {
          'enabled': 'Yes',
          'autoBatch': 'No'
        },
        'identifier': 'do_3131430588146155521345',
        'lastUpdatedBy': '87ce3810-6b3d-4427-bfb7-efe57b7efbd5',
        'audience': [
          'Teacher'
        ],
        'toc_url': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3131430588146155521345/artifact/do_3131430588146155521345_toc.json',
        'visibility': 'Default',
        'contentTypesCount': '{"PracticeResource":8,"CourseUnit":13,"ExplanationResource":24}',
        'author': 'NCERT',
        'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
        'childNodes': [
          'do_31313398097120460811398',
          'do_3131430588155166721351',
          'do_31313459126286745611582',
          'do_3131430588155740161363',
          'do_31313402698105651211544',
          'do_3131339728289546241845',
          'do_3131340293650841601930',
          'do_3131430588155985921365',
          'do_31313474605245235212030',
          'do_313133975595655168155',
          'do_31313472227985817611976',
          'do_3131339798579281921909',
          'do_3131430588155576321359',
          'do_31313483394648473611208',
          'do_31313483573434777611860',
          'do_31313458495336448011707',
          'do_3131430588156313601371',
          'do_31313477350508134412125',
          'do_3131430588156149761369',
          'do_3131339659511971841906',
          'do_31313471869309747211677',
          'do_3131430588155658241361',
          'do_3131347275282268161289',
          'do_3131430588155002881349',
          'do_3131430588155494401357',
          'do_3131430588155330561355',
          'do_31313478176004505611054',
          'do_31313396328849408011957',
          'do_31313402816037683211431',
          'do_3131340323801907201134',
          'do_3131339686433587201844',
          'do_3131430588155248641353',
          'do_3131339850007183361849',
          'do_31313475711469158411171',
          'do_3131292436049264641492',
          'do_31313474043200307211689',
          'do_3131345828580229121941',
          'do_31313476933029068811835',
          'do_31313478172178022411334',
          'do_3131430588156067841367',
          'do_31313478248306278411335',
          'do_31313403369611264011448',
          'do_3131430588154920961347',
          'do_3131340162837626881924',
          'do_31313397741881753611521'
        ],
        'mediaType': 'content',
        'osId': 'org.ekstep.quiz.app',
        'languageCode': [
          'en'
        ],
        'lastPublishedBy': '3254f264-5bed-49db-8e30-ce4d292978e3',
        'version': 2,
        'license': 'CC BY-SA 4.0',
        'prevState': 'Review',
        'size': 1104989,
        'lastPublishedOn': '2020-11-03T04:24:30.019+0000',
        'name': '.सी.टी का समन्वय (उत्तर प्रदेश) - test only',
        'status': 'Live',
        'code': 'org.sunbird.QCPlqd.copy.copy',
        'c_diksha_private_batch_count': 0,
        'credentials': {
          'enabled': 'Yes'
        },
        'prevStatus': 'Processing',
        'origin': 'do_3131427131586969601258',
        'description': 'सूचना एवं संचार तकनीक (आईसीटी ) व शिक्षा शास्त्र का शिक्षण - अधिगम में समायोजन का मॉड्यूल  शिक्षक/शिक्षक प्रशिक्षक को शिक्षण, अधिगम और मूल्यांकन में उपयुक्त आईसीटी को प्रयोग करने में सक्षम बनाता है।',
        'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130887519261818881205/artifact/nishtha_icon.jpg',
        'idealScreenSize': 'normal',
        'createdOn': '2020-11-03T04:21:36.708+0000',
        'reservedDialcodes': {
          'W1N3W5': 0
        },
        'batches': [
          {
            'createdFor': [
              '01246376237871104093'
            ],
            'endDate': null,
            'name': 'UP_शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी का समन्वय (उत्तर प्रदेश)',
            'batchId': '0131427256528404481',
            'enrollmentType': 'open',
            'enrollmentEndDate': null,
            'startDate': '2020-11-02',
            'status': 1
          }
        ],
        'copyrightYear': 2020,
        'contentDisposition': 'inline',
        'licenseterms': 'I agree that by submitting / publishing this Content, I confirm that this Content complies with the Terms of Use and Content Policy and that I consent to publish it under the Creative Commons Framework. I have made sure that I do not violate copyright or privacy rights of others',
        'lastUpdatedOn': '2020-11-03T04:24:29.890+0000',
        'originData': {
          'name': 'UP_शिक्षण, अधिगम और मूल्यांकन में आई.सी.टी का समन्वय (उत्तर प्रदेश)',
          'copyType': 'deep',
          'license': 'CC BY-SA 4.0',
          'organisation': [
            'सहज | SAHAJ'
          ],
          'author': 'NCERT'
        },
        'dialcodeRequired': 'No',
        'lastStatusChangedOn': '2020-11-03T04:24:31.063+0000',
        'createdFor': [
          '0123221758376673287017'
        ],
        'creator': 'Kumar Content Creator',
        'os': [
          'All'
        ],
        'c_diksha_open_batch_count': 0,
        'pkgVersion': 1,
        'versionKey': '1604377469890',
        'idealScreenDensity': 'hdpi',
        'framework': 'TPD',
        'dialcodes': [
          'W1N3W5'
        ],
        'depth': 0,
        's3Key': 'ecar_files/do_3131430588146155521345/.sii.ttii-kaa-smnvy-uttr-prdesh-test-only_1604377470557_do_3131430588146155521345_1.0_spine.ecar',
        'lastSubmittedOn': '2020-11-03T04:23:24.515+0000',
        'createdBy': '19abdacf-cb10-4d0b-a5c0-e68f2adb0a4c',
        'compatibilityLevel': 4,
        'leafNodesCount': 32,
        'userConsent': 'Yes',
        'resourceType': 'Course'
      }
    };
  }

  onNodeSelect(event: any) {
    this.selectedQuestionData = event;
  }

}
