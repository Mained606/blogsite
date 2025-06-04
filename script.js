// AOS 초기화
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // 스크롤 시 네비게이션 바 스타일 변경
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            
            if (scrollTop > lastScrollTop) {
                // 아래로 스크롤
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // 위로 스크롤
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴 닫기
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });

    // 이미지 로딩 처리
    function handleImageError(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        const icon = document.createElement('i');
        icon.className = 'fas fa-image fa-3x';
        placeholder.appendChild(icon);
        img.parentNode.replaceChild(placeholder, img);
    }

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });

    // 포트폴리오 아이템 호버 효과
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '0';
        });
    });

    // 포트폴리오 필터링
    const portfolioFilters = document.querySelectorAll('.portfolio-filter button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-filter');
            
            portfolioFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            portfolioItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 연락처 폼 제출
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 여기에 폼 제출 로직 추가
            alert('메시지가 전송되었습니다.');
            this.reset();
        });
    }

    // 프로젝트 데이터
    const projectData = {
        spaceship: {
            title: "SpaceShipLooting VR",
            type: "VR 잠입 액션 게임",
            period: "2023.11.25 ~ 2023.12.31 (5주)",
            teamSize: "5명 (부 팀장 및 개발 팀장)",
            environment: {
                development: "Unity 6 (URP), C#, Meta Quest",
                build: "PC, Android APK"
            },
            youtube: "NVzRJA02070",
            links: [
                { url: "https://github.com/Mained606/SpaceShipLooting_VR", icon: "github", text: "GitHub" },
                { url: "https://drive.google.com/file/d/1-kLGxgn0eo2nxvytOxzWS7SnPG50cNxC/view?usp=drive_link", icon: "download", text: "빌드 다운로드" }
            ],
            tech: ["XR Interaction Toolkit", "Oculus Integration", "상태 패턴", "커스텀 셰이더"],
            overview: "우주선을 배경으로 한 VR 잠입 액션 게임입니다. 플레이어는 우주선 내부를 탐험하며 총과 레이저 검을 활용해 퍼즐을 풀어 우주선을 탈취하고 보스를 처치하는 미션을 수행합니다. 팀장으로서 전체 시스템 설계 및 핵심 기능 구현을 주도하였고, 특히 VR 환경에 적합한 상호작용과 최적화된 사용자 경험 제공에 집중하였습니다.",
            responsibilities: [
                {
                    title: "VR 프로젝트 환경 구축",
                    points: [
                        "Meta Quest 기반 VR 개발 환경 설정",
                        "XR Interaction Toolkit 기반 상호작용 기능 구현",
                        "URP 설정을 통한 렌더링 최적화",
                        "안정적인 빌드를 위한 프로젝트 구조 설계"
                    ]
                },
                {
                    title: "플레이어 시스템 구현",
                    points: [
                        "VR 컨트롤러 입력 처리 및 장비 동기화 시스템 개발",
                        "체력, 데미지, 위치 추적 기능 구현",
                        "플레이어 장비(조끼, 나이트비전 등)의 정확한 위치 유지 기능 개발",
                        "조끼에 XR 소켓 오브젝트 기능으로 장비 장착 시스템 기능 개발",
                        "하트 사운드 시스템 구현 (거리별 심박 사운드 조절)"
                    ]
                },
                {
                    title: "보스 AI 시스템 개발",
                    points: [
                        "FSM을 활용한 보스 AI 구조 설계",
                        "공격 패턴, 상태 변화, 피격 로직 구현",
                        "체력 관리 및 전투 흐름 제어",
                        "보스 이펙트 VFX 구현 및 적용"
                    ]
                },
                {
                    title: "인터랙션 및 게임 시스템 구현",
                    points: [
                        "VR 컨트롤러 기반 상호작용 기능 구현",
                        "커스텀 아웃라인 셰이더 개발로 상호작용 시각 피드백 제공",
                        "아이템 획득 및 사용 시스템 구현",
                        "커스텀 셰이더 기반의 레드 도트 사이트 구현"
                    ]
                }
            ],
            challenges: [
                {
                    title: "VR 원점 동기화 문제",
                    problem: "VR 기기에서 원점 재설정 시 인게임 진입 후 플레이어 장비 위치 오류 발생",
                    solution: "BodyObjectPositionSetting 클래스를 통해 VR 카메라 위치 실시간 추적 및 상대 위치 계산 적용",
                    result: "기기 위치 변경에도 장비 위치가 정확히 유지됨"
                },
                {
                    title: "씬 전환 시 상태 초기화 문제",
                    problem: "씬 전환 시 플레이어 상태(총알 수 등)가 초기화됨",
                    solution: "중앙 GameManager 및 SaveLoad 시스템을 통한 상태 저장/복원 구조 설계",
                    result: "씬 전환 후에도 플레이어 상태가 유지되어 안정적인 게임 진행 가능"
                },
                {
                    title: "VFX 빌드 호환 문제",
                    problem: "보스 이펙트가 APK 빌드 환경에서 정상 출력되지 않음",
                    solution: "VFX 그래프 설정과 URP 렌더 설정에서 Depth Texture 및 Opaque Texture 옵션을 활성화",
                    result: "개발 및 빌드 환경 모두에서 이펙트가 동일하게 출력됨"
                }
            ],
            leadership: {
                teamwork: [
                    "Git 브랜치 전략 및 협업 워크플로우 학습",
                    "코드 리뷰 및 주간 회의를 통한 피드백 기반 개발 경험 축적"
                ],
                leadership: [
                    "프로젝트 초기 설정 및 코드 컨벤션 제시",
                    "팀원 역량 고려한 역할 분담 및 일정 조율",
                    "기술적 지원과 문제 해결을 주도하며 팀 분위기 조성"
                ]
            },
            outcomes: {
                technical: [
                    "VR 환경에서의 실질적인 개발 경험 확보",
                    "상태 관리, 데이터 저장, 셰이더 등 다양한 시스템 구현 경험",
                    "첫 팀 프로젝트를 통한 협업 프로세스 이해"
                ],
                soft: [
                    "리더십 및 협업 능력 강화",
                    "문제 해결 중심의 접근 방식 체득",
                    "효과적인 커뮤니케이션 능력 향상"
                ],
                process: [
                    "Git 기반 협업과 코드 리뷰 경험을 통해 실무에 필요한 개발 프로세스 숙지",
                    "빌드 세팅에 대한 기초 이해"
                ]
            },
            conclusion: "SpaceShipLooting VR은 저에게 처음으로 개발 팀장 역할을 맡아 본 프로젝트로, 단순히 기능 구현을 넘어서 프로젝트 구조 설계, 협업 프로세스 이해, 그리고 문제 해결 능력까지 성장할 수 있는 계기였습니다. 이를 바탕으로 Unity 기반 게임 클라이언트 개발자로서의 기본기를 다졌다고 자신합니다."
        },
        destiny: {
            title: "Destiny Savior",
            type: "판타지 3인칭 액션 RPG 게임",
            period: {
                prototype: "2025.01.06 ~ 2025.02.10",
                main: "2025.03.04 ~ 2025.04.23"
            },
            teamSize: "6명 (부 팀장 및 개발 팀장)",
            environment: {
                development: "Unity 2022.3 (URP), C#",
                build: "PC"
            },
            youtube: "oQkfw0fAKwE",
            links: [
                { url: "https://github.com/Mained606/DsProject", icon: "github", text: "GitHub" },
                { url: "https://drive.google.com/file/d/1ct5vo1cip51D-wZ6a6jS3Q4hZQguwTWb/view?usp=drive_link", icon: "download", text: "빌드 다운로드" }
            ],
            tech: ["상태 패턴", "옵저버 패턴", "싱글톤 패턴"],
            overview: "Destiny Savior는 판타지 세계관의 3인칭 액션 RPG 게임입니다. 플레이어는 검과 완드를 통해 마법과 같은 스킬을 사용하여 몬스터들과 전투를 벌이고, 드래곤을 동료로 삼아 같이 성장해나가는 여정을 경험합니다. 코어 시스템 개발자로서 게임의 기반이 되는 매니저 시스템과 상태 관리, 전투 시스템 등을 구현했습니다.",
            responsibilities: [
                {
                    title: "게임 코어 시스템 설계 및 구현",
                    points: [
                        "베이스 매니저 클래스 설계로 일관된 매니저 시스템 구축",
                        "게임 상태 머신을 통한 전체 게임 흐름 제어",
                        "매니저 간 의존성 관리 및 초기화 순서 제어",
                        "이벤트 기반 시스템으로 컴포넌트 간 결합도 최소화"
                    ]
                },
                {
                    title: "전투 시스템 개발",
                    points: [
                        "캐릭터 스탯 시스템 설계 및 구현",
                        "물리/마법 데미지 계산 로직 구현",
                        "버프/디버프 시스템 개발",
                        "원소 속성 시스템 구현",
                        "전투/탐험 상태 전환 관리"
                    ]
                },
                {
                    title: "펫 및 몬스터 시스템 개발",
                    points: [
                        "펫 진화 시스템 설계 및 구현",
                        "몬스터(보스포함) 스탯 시스템 설계 및 구현",
                        "몬스터 스폰 시스템 구현",
                        "몬스터 AI 개발",
                        "펫 AI 개발"
                    ]
                },
                {
                    title: "세이브 시스템 구현",
                    points: [
                        "캐릭터, 인벤토리, 스킬, 퀘스트 데이터 저장/로드",
                        "세이브 포인트 시스템 개발",
                        "씬 전환 시 게임 상태 유지 기능 구현"
                    ]
                },
                {
                    title: "입력 시스템 및 UI 상태 관리",
                    points: [
                        "상황별 입력 제어 시스템 구현",
                        "UI 상태에 따른 게임플레이 일시정지 처리",
                        "키 바인딩 시스템 개발",
                        "UI 상태 전환 및 중첩 관리"
                    ]
                }
            ],
            challenges: [
                {
                    title: "매니저 초기화 순서 문제 및 씬 전환 구조 설계",
                    problem: "메인 씬에서 대부분의 기능을 구현한 뒤 타이틀 씬을 추가하였는데, 매니저 시스템들이 타이틀 씬에서도 실행되면서 게임 흐름과 무관한 로직이 조기 실행되었습니다. 이로 인해 특정 매니저들이 아직 초기화되지 않은 상태에서 접근을 시도하여 NullReferenceException 등의 오류가 빈번히 발생했습니다.",
                    solution: "게임 전반의 흐름을 제어하는 게임 상태 머신(GameStateMachine)을 활용하여, 씬에 따라 필요한 매니저 기능만 동작하도록 구조를 분리했습니다. 베이스 매니저 클래스 설계와 게임 매니저의 RegisterManager 구조를 통해 매니저 초기화 순서를 통제하고, 매니저 간 의존성을 명확히 정의했습니다. 각 매니저는 게임 상태 변화에 반응하도록 이벤트 기반으로 동작하게 만들어, 씬 전환에 따른 로직 충돌을 방지했습니다.",
                    result: "타이틀/로딩/메인 씬 등 각 씬의 역할에 따라 매니저 동작이 분리되어 안정적인 초기화 흐름을 확보하였고, Null 오류와 불필요한 로직 실행 문제를 해결하여 전반적인 시스템 안정성을 높일 수 있었습니다."
                },
                {
                    title: "몬스터 AI 이동 오류 (Terrain 적용 문제)",
                    problem: "몬스터를 AI를 통해 스폰하여 이동시키는 기능을 구현했을 때, 기본 바닥(Plane)에서는 정상적으로 이동하였으나, 실제 게임 맵에서 Terrain을 사용하자 지형 높이 정보가 반영되지 않아 몬스터가 공중에 떠 있거나 땅속에 파묻히는 문제가 발생했습니다.",
                    solution: "Terrain.SampleHeight() 및 레이캐스트를 활용하여 이동 목표 지점의 정확한 지형 높이를 계산하고, 몬스터의 Y축 좌표를 실시간으로 보정했습니다. 스폰 시점뿐 아니라 이동 중에도 지형 정보를 지속적으로 확인하도록 로직을 구성하고, 지형 밖의 비정상 영역 진입을 방지하기 위한 검증 로직을 추가했습니다. 착지 상태(grounded)를 수시로 체크하여 공중 부양이나 지형 하강 현상을 실시간으로 차단했습니다.",
                    result: "몬스터가 지형의 높낮이에 따라 자연스럽게 이동하게 되었으며, 스폰 위치와 경로 상에서도 Terrain과의 충돌 오류가 해결되었습니다. 유효하지 않은 지형으로의 이동이 제한되면서 게임 전반의 물리 및 AI 안정성이 향상되었습니다."
                },
                {
                    title: "게임 상태 전환 시 데이터 동기화 문제",
                    problem: "UI 상태 전환 시 게임플레이 상태와 데이터 동기화가 불일치하여 오작동 발생",
                    solution: "게임 상태 머신 도입으로 상태 전환을 통합적으로 관리하고, 타이머 매니저를 통한 일시정지 시스템 구현 (UI 활성화시 상태 전환을 통해 모든 로직 일시정지), 이벤트 시스템을 활용해 상태 변경 알림을 각 매니저에 전달",
                    result: "UI/게임 상태 간 데이터 동기화가 안정적으로 이루어져 시스템 신뢰성과 UX가 개선됨"
                }
            ],
            outcomes: {
                technical: [
                    "디자인 패턴을 활용한 확장 가능한 시스템 설계 경험",
                    "이벤트 기반 프로그래밍의 실전 적용",
                    "대규모 프로젝트의 데이터 관리 및 직렬화 경험"
                ],
                soft: [
                    "코어 시스템 문서화를 통한 팀 생산성 향상",
                    "재사용 가능한 컴포넌트 설계로 개발 효율성 증대",
                    "코드 리뷰를 통한 품질 관리 프로세스 정립"
                ],
                process: [
                    "시스템 의존성 분석 및 관리 능력 향상",
                    "장기 프로젝트의 버전 관리 및 유지보수 경험"
                ]
            },
            conclusion: "이 프로젝트를 통해 게임 시스템 설계의 중요성과 확장 가능한 아키텍처의 가치를 깊이 이해하게 되었습니다. 특히 이벤트 기반 시스템과 상태 패턴의 활용이 대규모 프로젝트에서 얼마나 효과적인지 실감할 수 있었습니다. 이러한 경험은 앞으로의 게임 개발 프로젝트에서 큰 자산이 될 것이라 생각됩니다."
        },
        binglerun: {
            title: "빙글런 펫즈",
            type: "하이브리드 러닝 게임",
            period: "2023.07.01 ~ 2023.08.31 (8주)",
            youtube: "dQw4w9WgXcQ",
            links: [
                { url: "https://github.com/Mained606/BingleRunPets", icon: "github", text: "GitHub" }
            ],
            tech: ["Unity 2022.3 URP", "C#", "Firebase", "Google Play Services", "AdMob"],
            overview: "귀여운 펫을 수집하고 육성하며 달리는 하이브리드 러닝 게임입니다. 실시간 멀티플레이와 소셜 기능을 통해 다른 플레이어들과 경쟁하고 협력할 수 있습니다. 클라이언트 개발자로서 게임의 핵심 시스템과 소셜 기능을 구현했습니다.",
            details: [
                {
                    title: "게임플레이 시스템",
                    points: [
                        "프로시저럴 레벨 생성 시스템 구현",
                        "펫 수집 및 육성 시스템 개발",
                        "실시간 멀티플레이 레이스 모드 구현",
                        "일일 미션 및 업적 시스템 구현"
                    ]
                },
                {
                    title: "백엔드 연동",
                    points: [
                        "Firebase를 활용한 유저 데이터 관리",
                        "실시간 랭킹 시스템 구현",
                        "친구 초대 및 선물 시스템 개발",
                        "푸시 알림 시스템 구현"
                    ]
                },
                {
                    title: "수익화 시스템",
                    points: [
                        "인앱 결제 시스템 구현",
                        "리워드 광고 시스템 연동",
                        "일일 보상 및 출석 체크 시스템 개발"
                    ]
                }
            ]
        }
    };

    // 모달 관련 요소
    const modal = document.querySelector('.project-modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = modal.querySelector('.modal-body');
    const closeModal = modal.querySelector('.close-modal');

    console.log('Modal elements:', { modal, modalContent, modalBody, closeModal });

    // 모달 열기 함수
    function openModal(projectId) {
        console.log('Opening modal for project:', projectId);
        const project = projectData[projectId];
        if (!project) {
            console.error('Project not found:', projectId);
            return;
        }

        modalBody.innerHTML = `
            <div class="project-header">
                <h3>${project.title}</h3>
                <p class="project-type">${project.type}</p>
            </div>

            <div class="project-info">
                <div class="info-group">
                    <h4>팀 프로젝트 개요</h4>
                    <ul class="info-list">
                        <li><strong>개발 기간:</strong> ${
                            project.period.prototype ? 
                            `1차 프로토타입: ${project.period.prototype}<br>
                             2차 본 프로젝트: ${project.period.main}` :
                            project.period
                        }</li>
                        <li><strong>개발 인원:</strong> ${project.teamSize || '정보 없음'}</li>
                        <li><strong>개발 환경:</strong> ${project.environment ? project.environment.development : '정보 없음'}</li>
                        <li><strong>빌드 환경:</strong> ${project.environment ? project.environment.build : '정보 없음'}</li>
                    </ul>
                </div>
            </div>

            ${project.youtube ? `
            <div class="video-container mb-4">
                <iframe
                    width="100%"
                    height="400"
                    src="https://www.youtube.com/embed/${project.youtube}"
                    title="${project.title} 시연 영상"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
            ` : ''}

            <div class="project-links mb-4">
                ${project.links.map(link => `
                    <a href="${link.url}" target="_blank" class="btn btn-outline-primary">
                        <i class="fab fa-${link.icon}"></i> ${link.text}
                    </a>
                `).join('')}
            </div>

            <div class="tech-stack mb-4">
                <h4>기술 스택</h4>
                <div class="tech-tags">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>

            <div class="project-overview mb-4">
                <h4 class="section-title">프로젝트 요약</h4>
                <p>${project.overview}</p>
            </div>

            <div class="responsibilities mb-4">
                <h4 class="section-title">주요 담당 업무</h4>
                ${project.responsibilities.map(resp => `
                    <div class="responsibility-group">
                        <h5>${resp.title}</h5>
                        <ul>
                            ${resp.points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            <div class="challenges mb-4">
                <h4 class="section-title">문제 해결 경험</h4>
                ${project.challenges.map(challenge => `
                    <div class="challenge-card">
                        <h5>${challenge.title}</h5>
                        <p><strong>문제:</strong> ${challenge.problem}</p>
                        <p><strong>해결:</strong> ${challenge.solution}</p>
                        <p><strong>결과:</strong> ${challenge.result}</p>
                    </div>
                `).join('')}
            </div>

            <div class="outcomes-section mb-4">
                <h4 class="section-title">성과 및 배운 점</h4>
                <div class="outcomes-group">
                    <h5>기술적 성장</h5>
                    <ul>
                        ${project.outcomes.technical.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <h5>소프트 스킬 향상</h5>
                    <ul>
                        ${project.outcomes.soft.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <h5>개발 프로세스 이해</h5>
                    <ul>
                        ${project.outcomes.process.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="conclusion">
                <p>${project.conclusion}</p>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // 모달 닫기 함수
    function closeModalHandler() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // 포트폴리오 아이템 클릭 이벤트
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project');
            console.log('Portfolio item clicked:', projectId);
            openModal(projectId);
        });
    });

    // 자세히 보기 버튼 클릭 이벤트
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 이벤트 버블링 방지
            const projectId = e.target.closest('.portfolio-item').getAttribute('data-project');
            console.log('View project button clicked:', projectId);
            openModal(projectId);
        });
    });

    // 모달 닫기 버튼 이벤트
    closeModal.addEventListener('click', closeModalHandler);

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModalHandler();
        }
    });
}); 